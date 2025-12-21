import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'

describe('Header', () => {
  it('renders hostname from config', () => {
    render(<Header />)
    expect(screen.getByText('transfer.sh')).toBeInTheDocument()
  })

  it('renders upload icon', () => {
    const { container } = render(<Header />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders home link', () => {
    render(<Header />)
    const link = screen.getByRole('link', { name: /transfer\.sh/i })
    expect(link).toHaveAttribute('href', '/')
  })

  it('does not show upload link by default', () => {
    render(<Header />)
    expect(screen.queryByText('Upload Files')).not.toBeInTheDocument()
  })

  it('shows upload link when showUploadLink is true', () => {
    render(<Header showUploadLink />)
    expect(screen.getByText('Upload Files')).toBeInTheDocument()
  })

  it('renders ThemeToggle', () => {
    render(<Header />)
    expect(screen.getByLabelText(/Switch to System theme/i)).toBeInTheDocument()
  })
})
