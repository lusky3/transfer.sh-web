import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('defaults to system theme', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('system')
  })

  it('persists theme to localStorage', () => {
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.setTheme('dark')
    })
    
    expect(localStorage.getItem('transfer-sh-theme')).toBe('dark')
    expect(result.current.theme).toBe('dark')
  })

  it('applies dark class when dark theme is set', () => {
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.setTheme('dark')
    })
    
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark class when light theme is set', () => {
    document.documentElement.classList.add('dark')
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.setTheme('light')
    })
    
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('loads theme from localStorage on init', () => {
    localStorage.setItem('transfer-sh-theme', 'dark')
    
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.theme).toBe('dark')
  })

  it('responds to system theme changes when in system mode', () => {
    let changeHandler: (() => void) | null = null
    const mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'change') changeHandler = handler
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
    
    vi.spyOn(window, 'matchMedia').mockReturnValue(mockMediaQuery as unknown as MediaQueryList)
    
    const { result } = renderHook(() => useTheme())
    
    // Should be in system mode by default
    expect(result.current.theme).toBe('system')
    
    // Simulate system theme change to dark
    mockMediaQuery.matches = true
    act(() => {
      if (changeHandler) changeHandler()
    })
    
    // Should apply dark class when system changes to dark
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('does not respond to system changes when not in system mode', () => {
    let changeHandler: (() => void) | null = null
    const mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'change') changeHandler = handler
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
    
    vi.spyOn(window, 'matchMedia').mockReturnValue(mockMediaQuery as unknown as MediaQueryList)
    
    const { result } = renderHook(() => useTheme())
    
    // Set to light mode explicitly
    act(() => {
      result.current.setTheme('light')
    })
    
    document.documentElement.classList.remove('dark')
    
    // Simulate system theme change to dark
    mockMediaQuery.matches = true
    act(() => {
      if (changeHandler) changeHandler()
    })
    
    // Should NOT apply dark class because we're in light mode, not system
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('cleans up event listener on unmount', () => {
    const removeEventListener = vi.fn()
    const mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener,
      dispatchEvent: vi.fn(),
    }
    
    vi.spyOn(window, 'matchMedia').mockReturnValue(mockMediaQuery as unknown as MediaQueryList)
    
    const { unmount } = renderHook(() => useTheme())
    
    unmount()
    
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
