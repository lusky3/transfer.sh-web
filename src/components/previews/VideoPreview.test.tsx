import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { VideoPreview } from './VideoPreview';

describe('VideoPreview', () => {
  it('renders video element', () => {
    const { container } = render(
      <VideoPreview url="https://example.com/video.mp4" contentType="video/mp4" />
    );
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
  });

  it('renders with controls', () => {
    const { container } = render(
      <VideoPreview url="https://example.com/video.mp4" contentType="video/mp4" />
    );
    const video = container.querySelector('video');
    expect(video).toHaveAttribute('controls');
  });

  it('renders source with correct url and type', () => {
    const { container } = render(
      <VideoPreview url="https://example.com/video.mp4" contentType="video/mp4" />
    );
    const source = container.querySelector('source');
    expect(source).toHaveAttribute('src', 'https://example.com/video.mp4');
    expect(source).toHaveAttribute('type', 'video/mp4');
  });

  it('has preload metadata attribute', () => {
    const { container } = render(
      <VideoPreview url="https://example.com/video.mp4" contentType="video/mp4" />
    );
    const video = container.querySelector('video');
    expect(video).toHaveAttribute('preload', 'metadata');
  });
});
