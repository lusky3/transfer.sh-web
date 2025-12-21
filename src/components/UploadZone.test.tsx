import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { UploadZone } from './UploadZone'

// Mock crypto.randomUUID
let uuidCounter = 0
vi.stubGlobal('crypto', {
  randomUUID: () => `test-uuid-${++uuidCounter}`,
})

// Helper to create mock XHR
function createMockXHR(options: {
  status?: number
  responseText?: string
  deletionHeader?: string | null
} = {}) {
  const { status = 200, responseText = '', deletionHeader = null } = options
  return {
    open: vi.fn(),
    send: vi.fn(),
    upload: { addEventListener: vi.fn() },
    onload: null as (() => void) | null,
    onerror: null as (() => void) | null,
    status,
    responseText,
    getResponseHeader: vi.fn().mockReturnValue(deletionHeader),
  }
}

describe('UploadZone', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    uuidCounter = 0
  })

  it('renders drop zone', () => {
    render(<UploadZone />)
    expect(screen.getByText(/Drag & drop files here/)).toBeInTheDocument()
  })

  it('renders browse text', () => {
    render(<UploadZone />)
    expect(screen.getByText('browse')).toBeInTheDocument()
  })

  it('shows drag state when dragging over', () => {
    render(<UploadZone />)
    const dropZone = screen.getByText(/Drag & drop files here/).closest('div')!
    
    fireEvent.dragOver(dropZone)
    expect(screen.getByText('Drop files here')).toBeInTheDocument()
  })

  it('resets drag state on drag leave', () => {
    render(<UploadZone />)
    const dropZone = screen.getByText(/Drag & drop files here/).closest('div')!
    
    fireEvent.dragOver(dropZone)
    fireEvent.dragLeave(dropZone)
    expect(screen.getByText(/Drag & drop files here/)).toBeInTheDocument()
  })

  it('has hidden file input', () => {
    const { container } = render(<UploadZone />)
    const input = container.querySelector('input[type="file"]')
    expect(input).toHaveClass('hidden')
    expect(input).toHaveAttribute('multiple')
  })

  it('opens file dialog when clicking drop zone', () => {
    const { container } = render(<UploadZone />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const clickSpy = vi.spyOn(input, 'click')
    
    const dropZone = screen.getByText(/Drag & drop files here/).closest('div')!
    fireEvent.click(dropZone)
    
    expect(clickSpy).toHaveBeenCalled()
  })

  it('uploads file when dropped', async () => {
    const mockXHR = createMockXHR({
      responseText: 'https://transfer.sh/abc123/test.txt',
      deletionHeader: 'https://transfer.sh/abc123/test.txt/delete123',
    })
    vi.stubGlobal('XMLHttpRequest', vi.fn(() => mockXHR))

    render(<UploadZone />)
    const dropZone = screen.getByText(/Drag & drop files here/).closest('div')!
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const dataTransfer = { files: [file] }
    
    fireEvent.drop(dropZone, { dataTransfer })
    
    await act(async () => {
      if (mockXHR.onload) mockXHR.onload()
    })

    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument()
    })
  })

  it('shows file size', async () => {
    const mockXHR = createMockXHR({
      responseText: 'https://transfer.sh/abc123/test.txt',
    })
    vi.stubGlobal('XMLHttpRequest', vi.fn(() => mockXHR))

    render(<UploadZone />)
    const dropZone = screen.getByText(/Drag & drop files here/).closest('div')!
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const dataTransfer = { files: [file] }
    
    fireEvent.drop(dropZone, { dataTransfer })
    
    await act(async () => {
      if (mockXHR.onload) mockXHR.onload()
    })

    await waitFor(() => {
      expect(screen.getByText(/Bytes/)).toBeInTheDocument()
    })
  })

  it('allows removing uploaded file', async () => {
    const mockXHR = createMockXHR({
      responseText: 'https://transfer.sh/abc123/test.txt',
    })
    vi.stubGlobal('XMLHttpRequest', vi.fn(() => mockXHR))

    render(<UploadZone />)
    const dropZone = screen.getByText(/Drag & drop files here/).closest('div')!
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } })
    
    await act(async () => {
      if (mockXHR.onload) mockXHR.onload()
    })

    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument()
    })

    const removeButton = screen.getByRole('button')
    fireEvent.click(removeButton)
    
    expect(screen.queryByText('test.txt')).not.toBeInTheDocument()
  })
})


  it('handles file input change', async () => {
    const mockXHR = createMockXHR({
      responseText: 'https://transfer.sh/abc123/test.txt',
    })
    vi.stubGlobal('XMLHttpRequest', vi.fn(() => mockXHR))

    const { container } = render(<UploadZone />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    
    const file = new File(['test'], 'input-file.txt', { type: 'text/plain' })
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })

    await act(async () => {
      if (mockXHR.onload) mockXHR.onload()
    })

    await waitFor(() => {
      expect(screen.getByText('input-file.txt')).toBeInTheDocument()
    })
  })

  it('shows upload progress', async () => {
    let progressCallback: ((e: { lengthComputable: boolean; loaded: number; total: number }) => void) | null = null
    const mockXHR = {
      open: vi.fn(),
      send: vi.fn(),
      upload: { 
        addEventListener: vi.fn((event: string, cb: (e: { lengthComputable: boolean; loaded: number; total: number }) => void) => {
          if (event === 'progress') {
            progressCallback = cb
          }
        })
      },
      onload: null as (() => void) | null,
      onerror: null as (() => void) | null,
      status: 0,
      responseText: '',
      getResponseHeader: vi.fn().mockReturnValue(null),
    }
    vi.stubGlobal('XMLHttpRequest', vi.fn(() => mockXHR))

    render(<UploadZone />)
    const dropZone = screen.getByText(/Drag & drop files here/).closest('div')!
    
    const file = new File(['test content here'], 'progress-test.txt', { type: 'text/plain' })
    
    await act(async () => {
      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } })
    })

    // Simulate progress event
    await act(async () => {
      if (progressCallback) {
        progressCallback({ lengthComputable: true, loaded: 50, total: 100 })
      }
    })

    // File should be in uploading state
    expect(screen.getByText('progress-test.txt')).toBeInTheDocument()
  })

  it('shows error state on upload failure', async () => {
    const mockXHR = createMockXHR({ status: 500 })
    vi.stubGlobal('XMLHttpRequest', vi.fn(() => mockXHR))

    render(<UploadZone />)
    const dropZone = screen.getByText(/Drag & drop files here/).closest('div')!
    
    const file = new File(['test'], 'error-file.txt', { type: 'text/plain' })
    
    await act(async () => {
      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } })
    })

    await act(async () => {
      if (mockXHR.onload) mockXHR.onload()
    })

    await waitFor(() => {
      expect(screen.getByText(/Upload failed/)).toBeInTheDocument()
    })
  })

  it('shows deletion token when provided', async () => {
    const mockXHR = createMockXHR({
      responseText: 'https://transfer.sh/abc123/test.txt',
      deletionHeader: 'https://transfer.sh/abc123/test.txt/mytoken123',
    })
    vi.stubGlobal('XMLHttpRequest', vi.fn(() => mockXHR))

    render(<UploadZone />)
    const dropZone = screen.getByText(/Drag & drop files here/).closest('div')!
    
    const file = new File(['test'], 'token-file.txt', { type: 'text/plain' })
    
    await act(async () => {
      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } })
    })

    await act(async () => {
      if (mockXHR.onload) mockXHR.onload()
    })

    await waitFor(() => {
      expect(screen.getByText('mytoken123')).toBeInTheDocument()
    })
  })

  it('shows download all buttons for multiple completed files', async () => {
    const mockXHR = createMockXHR({
      responseText: 'https://transfer.sh/abc123/file1.txt',
    })
    vi.stubGlobal('XMLHttpRequest', vi.fn(() => mockXHR))

    render(<UploadZone />)
    const dropZone = screen.getByText(/Drag & drop files here/).closest('div')!
    
    // Upload first file
    const file1 = new File(['test1'], 'file1.txt', { type: 'text/plain' })
    await act(async () => {
      fireEvent.drop(dropZone, { dataTransfer: { files: [file1] } })
    })
    await act(async () => {
      if (mockXHR.onload) mockXHR.onload()
    })

    // Upload second file
    mockXHR.responseText = 'https://transfer.sh/def456/file2.txt'
    const file2 = new File(['test2'], 'file2.txt', { type: 'text/plain' })
    await act(async () => {
      fireEvent.drop(dropZone, { dataTransfer: { files: [file2] } })
    })
    await act(async () => {
      if (mockXHR.onload) mockXHR.onload()
    })

    await waitFor(() => {
      expect(screen.getByText('Download all as ZIP')).toBeInTheDocument()
      expect(screen.getByText('Download all as TAR.GZ')).toBeInTheDocument()
    })
  })

  it('handles null fileList gracefully', () => {
    const { container } = render(<UploadZone />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    
    // Simulate change with null files
    fireEvent.change(input, { target: { files: null } })
    
    // Should not crash, no files should be added
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders completed file as link', async () => {
    const mockXHR = createMockXHR({
      responseText: 'https://transfer.sh/abc123/linked-file.txt',
    })
    vi.stubGlobal('XMLHttpRequest', vi.fn(() => mockXHR))

    render(<UploadZone />)
    const dropZone = screen.getByText(/Drag & drop files here/).closest('div')!
    
    const file = new File(['test'], 'linked-file.txt', { type: 'text/plain' })
    await act(async () => {
      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } })
    })
    await act(async () => {
      if (mockXHR.onload) mockXHR.onload()
    })

    await waitFor(() => {
      const link = screen.getByRole('link', { name: 'linked-file.txt' })
      expect(link).toHaveAttribute('href', 'https://transfer.sh/abc123/linked-file.txt')
      expect(link).toHaveAttribute('target', '_blank')
    })
  })
