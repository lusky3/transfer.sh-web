import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './Home';

describe('Home Page', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('renders main heading', () => {
    render(<App />);
    expect(screen.getByText('Easy file sharing from the command line')).toBeInTheDocument();
  });

  it('renders subheading', () => {
    render(<App />);
    expect(screen.getByText(/Upload files with a simple cURL command/)).toBeInTheDocument();
  });

  it('renders terminal demo', () => {
    render(<App />);
    expect(screen.getByText(/Upload using cURL/)).toBeInTheDocument();
  });

  it('renders upload zone section', () => {
    render(<App />);
    expect(screen.getByText('Or upload from the web')).toBeInTheDocument();
  });

  it('renders Features section', () => {
    render(<App />);
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders Examples section', () => {
    render(<App />);
    expect(screen.getByText('Usage Examples')).toBeInTheDocument();
  });

  it('renders header', () => {
    render(<App />);
    expect(screen.getByText('transfer.sh')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<App />);
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
  });

  it('renders drag and drop zone', () => {
    render(<App />);
    expect(screen.getByText(/Drag & drop files here/)).toBeInTheDocument();
  });
});
