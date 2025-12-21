import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { Terminal, CodeLine, CopyableCode } from './Terminal'

describe('Terminal', () => {
  it('renders children', () => {
    render(
      <Terminal>
        <span>Test content</span>
      </Terminal>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(
      <Terminal title="my-terminal">
        <span>Content</span>
      </Terminal>
    )
    
    expect(screen.getByText('my-terminal')).toBeInTheDocument()
  })

  it('renders terminal dots', () => {
    const { container } = render(
      <Terminal>
        <span>Content</span>
      </Terminal>
    )
    
    const dots = container.querySelectorAll('.terminal-dot')
    expect(dots).toHaveLength(3)
  })
})

describe('CodeLine', () => {
  it('renders comment with # prefix', () => {
    render(<CodeLine comment="This is a comment" />)
    
    expect(screen.getByText(/# This is a comment/)).toBeInTheDocument()
  })

  it('renders command with $ prefix', () => {
    render(<CodeLine command="npm install" />)
    
    expect(screen.getByText(/\$ npm install/)).toBeInTheDocument()
  })

  it('renders output without prefix', () => {
    render(<CodeLine output="Success!" />)
    
    expect(screen.getByText('Success!')).toBeInTheDocument()
  })
})


describe('CopyableCode', () => {
  it('renders code content', () => {
    render(<CopyableCode code="const x = 1;" />)
    expect(screen.getByText('const x = 1;')).toBeInTheDocument()
  })

  it('renders copy button', () => {
    render(<CopyableCode code="test code" />)
    expect(screen.getByTitle('Copy to clipboard')).toBeInTheDocument()
  })

  it('copies code to clipboard when button clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    render(<CopyableCode code="test code" />)
    
    await act(async () => {
      fireEvent.click(screen.getByTitle('Copy to clipboard'))
    })
    
    expect(writeText).toHaveBeenCalledWith('test code')
  })

  it('shows check icon after copying', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    const { container } = render(<CopyableCode code="test code" />)
    
    await act(async () => {
      fireEvent.click(screen.getByTitle('Copy to clipboard'))
    })
    
    // Check icon should be visible (green-500 class)
    expect(container.querySelector('.text-green-500')).toBeInTheDocument()
    
    // After 2 seconds, should revert
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    
    expect(container.querySelector('.text-gray-500')).toBeInTheDocument()
    
    vi.useRealTimers()
  })

  it('applies custom className', () => {
    const { container } = render(<CopyableCode code="test" className="custom-class" />)
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
