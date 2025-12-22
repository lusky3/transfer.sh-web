import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GenericPreview } from './GenericPreview';

describe('GenericPreview', () => {
  it('renders filename', () => {
    render(<GenericPreview filename="test.bin" contentType="application/octet-stream" />);
    expect(screen.getByText('test.bin')).toBeInTheDocument();
  });

  it('renders content type', () => {
    render(<GenericPreview filename="test.bin" contentType="application/octet-stream" />);
    expect(screen.getByText('application/octet-stream')).toBeInTheDocument();
  });

  it('renders preview not available message', () => {
    render(<GenericPreview filename="test.bin" contentType="application/octet-stream" />);
    expect(screen.getByText('Preview not available for this file type')).toBeInTheDocument();
  });

  it('renders archive icon for zip files', () => {
    const { container } = render(
      <GenericPreview filename="archive.zip" contentType="application/zip" />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders archive icon for tar files', () => {
    const { container } = render(
      <GenericPreview filename="archive.tar.gz" contentType="application/x-tar" />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders spreadsheet icon for xlsx files', () => {
    const { container } = render(
      <GenericPreview
        filename="data.xlsx"
        contentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders spreadsheet icon for csv files', () => {
    const { container } = render(<GenericPreview filename="data.csv" contentType="text/csv" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders text icon for text content type', () => {
    const { container } = render(<GenericPreview filename="readme.txt" contentType="text/plain" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
