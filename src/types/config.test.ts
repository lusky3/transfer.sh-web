import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getConfig, type AppConfig, type DownloadConfig } from './config'

describe('getConfig', () => {
  const originalConfig = window.__CONFIG__

  afterEach(() => {
    window.__CONFIG__ = originalConfig
  })

  it('returns window.__CONFIG__ when set', () => {
    const config = getConfig()
    expect(config.webAddress).toBe('https://transfer.sh/')
    expect(config.hostname).toBe('transfer.sh')
  })

  it('returns default config when window.__CONFIG__ is undefined', () => {
    // @ts-expect-error - testing undefined case
    window.__CONFIG__ = undefined
    const config = getConfig()
    expect(config.webAddress).toBe('https://transfer.sh/')
    expect(config.hostname).toBe('transfer.sh')
  })

  it('returns typed config for DownloadConfig', () => {
    window.__CONFIG__ = {
      webAddress: 'https://test.sh/',
      hostname: 'test.sh',
      filename: 'test.txt',
      contentType: 'text/plain',
      contentLength: '1024',
      downloadUrl: 'https://test.sh/abc/test.txt',
      previewType: 'code',
    } as DownloadConfig

    const config = getConfig<DownloadConfig>()
    expect(config.filename).toBe('test.txt')
    expect(config.previewType).toBe('code')
  })

  it('includes optional fields when present', () => {
    const config = getConfig<AppConfig>()
    expect(config.emailContact).toBe('test@example.com')
    expect(config.maxUploadSize).toBe('10GB')
    expect(config.purgeTime).toBe('14 days')
  })
})
