import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ImagePreview } from './ImagePreview'

describe('ImagePreview', () => {
  it('renders image with correct src and alt', () => {
    render(<ImagePreview url="https://example.com/image.png" filename="image.png" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/image.png')
    expect(img).toHaveAttribute('alt', 'image.png')
  })

  it('renders zoom controls', () => {
    render(<ImagePreview url="https://example.com/image.png" filename="image.png" />)
    expect(screen.getByTitle('Zoom in')).toBeInTheDocument()
    expect(screen.getByTitle('Zoom out')).toBeInTheDocument()
    expect(screen.getByTitle('Rotate')).toBeInTheDocument()
  })

  it('shows initial scale of 100%', () => {
    render(<ImagePreview url="https://example.com/image.png" filename="image.png" />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('increases scale when zoom in clicked', () => {
    render(<ImagePreview url="https://example.com/image.png" filename="image.png" />)
    const zoomIn = screen.getByTitle('Zoom in')
    fireEvent.click(zoomIn)
    expect(screen.getByText('125%')).toBeInTheDocument()
  })

  it('decreases scale when zoom out clicked', () => {
    render(<ImagePreview url="https://example.com/image.png" filename="image.png" />)
    const zoomOut = screen.getByTitle('Zoom out')
    fireEvent.click(zoomOut)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('rotates image when rotate clicked', () => {
    render(<ImagePreview url="https://example.com/image.png" filename="image.png" />)
    const rotate = screen.getByTitle('Rotate')
    const img = screen.getByRole('img')
    
    fireEvent.click(rotate)
    expect(img).toHaveStyle({ transform: 'scale(1) rotate(90deg)' })
  })

  it('limits zoom out to 50%', () => {
    render(<ImagePreview url="https://example.com/image.png" filename="image.png" />)
    const zoomOut = screen.getByTitle('Zoom out')
    
    // Click 3 times to try to go below 50%
    fireEvent.click(zoomOut)
    fireEvent.click(zoomOut)
    fireEvent.click(zoomOut)
    
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('limits zoom in to 300%', () => {
    render(<ImagePreview url="https://example.com/image.png" filename="image.png" />)
    const zoomIn = screen.getByTitle('Zoom in')
    
    // Click 10 times to try to go above 300%
    for (let i = 0; i < 10; i++) {
      fireEvent.click(zoomIn)
    }
    
    expect(screen.getByText('300%')).toBeInTheDocument()
  })

  it('rotates through 360 degrees', () => {
    render(<ImagePreview url="https://example.com/image.png" filename="image.png" />)
    const rotate = screen.getByTitle('Rotate')
    const img = screen.getByRole('img')
    
    fireEvent.click(rotate) // 90
    fireEvent.click(rotate) // 180
    fireEvent.click(rotate) // 270
    fireEvent.click(rotate) // 0
    
    expect(img).toHaveStyle({ transform: 'scale(1) rotate(0deg)' })
  })
})
