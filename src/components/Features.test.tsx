import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Features } from './Features'

describe('Features', () => {
  it('renders section heading', () => {
    render(<Features />)
    expect(screen.getByText('Features')).toBeInTheDocument()
  })

  it('renders base features', () => {
    render(<Features />)
    expect(screen.getByText('Made for the shell')).toBeInTheDocument()
    expect(screen.getByText('Share with a URL')).toBeInTheDocument()
    expect(screen.getByText('Free to use')).toBeInTheDocument()
    expect(screen.getByText('Encrypt your files')).toBeInTheDocument()
    expect(screen.getByText('Limit downloads')).toBeInTheDocument()
    expect(screen.getByText('Preview in browser')).toBeInTheDocument()
  })

  it('renders upload size from config', () => {
    render(<Features />)
    expect(screen.getByText('Upload up to 10GB')).toBeInTheDocument()
  })

  it('renders purge time from config', () => {
    render(<Features />)
    expect(screen.getByText('Stored for 14 days')).toBeInTheDocument()
  })

  it('renders feature descriptions', () => {
    render(<Features />)
    expect(screen.getByText('Upload files directly from your terminal')).toBeInTheDocument()
    expect(screen.getByText('Get a unique link for every file')).toBeInTheDocument()
  })
})
