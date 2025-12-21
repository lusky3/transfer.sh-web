import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renders three theme buttons', () => {
    render(<ThemeToggle />)
    expect(screen.getByLabelText('Switch to System theme')).toBeInTheDocument()
    expect(screen.getByLabelText('Switch to Light theme')).toBeInTheDocument()
    expect(screen.getByLabelText('Switch to Dark theme')).toBeInTheDocument()
  })

  it('switches to dark theme when dark button clicked', () => {
    render(<ThemeToggle />)
    const darkButton = screen.getByLabelText('Switch to Dark theme')
    fireEvent.click(darkButton)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('switches to light theme when light button clicked', () => {
    document.documentElement.classList.add('dark')
    render(<ThemeToggle />)
    const lightButton = screen.getByLabelText('Switch to Light theme')
    fireEvent.click(lightButton)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('has correct button titles', () => {
    render(<ThemeToggle />)
    expect(screen.getByTitle('System')).toBeInTheDocument()
    expect(screen.getByTitle('Light')).toBeInTheDocument()
    expect(screen.getByTitle('Dark')).toBeInTheDocument()
  })
})
