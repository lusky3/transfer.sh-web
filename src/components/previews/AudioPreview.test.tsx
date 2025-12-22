import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AudioPreview } from './AudioPreview';

describe('AudioPreview', () => {
  it('renders filename', () => {
    render(<AudioPreview url="https://example.com/song.mp3" filename="song.mp3" />);
    expect(screen.getByText('song.mp3')).toBeInTheDocument();
  });

  it('renders audio element with controls', () => {
    const { container } = render(
      <AudioPreview url="https://example.com/song.mp3" filename="song.mp3" />
    );
    const audio = container.querySelector('audio');
    expect(audio).toBeInTheDocument();
    expect(audio).toHaveAttribute('controls');
  });

  it('renders source with correct url', () => {
    const { container } = render(
      <AudioPreview url="https://example.com/song.mp3" filename="song.mp3" />
    );
    const source = container.querySelector('source');
    expect(source).toHaveAttribute('src', 'https://example.com/song.mp3');
  });

  it('renders music icon', () => {
    const { container } = render(
      <AudioPreview url="https://example.com/song.mp3" filename="song.mp3" />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
