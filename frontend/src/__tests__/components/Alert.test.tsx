import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from '../../components/Alert';

describe('Alert Component', () => {
  const mockOnClose = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <Alert
        type="success"
        message="Test message"
        isOpen={false}
        onClose={mockOnClose}
      />
    );
    
    const alert = screen.queryByText('Test message');
    expect(alert).not.toBeInTheDocument();
  });

  it('should render with correct message when isOpen is true', () => {
    render(
      <Alert
        type="success"
        message="Test message"
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    const message = screen.getByText('Test message');
    expect(message).toBeInTheDocument();
  });

  it('should render with title when provided', () => {
    render(
      <Alert
        type="success"
        title="Test Title"
        message="Test message"
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    const title = screen.getByText('Test Title');
    expect(title).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <Alert
        type="success"
        message="Test message"
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should auto close after specified time', () => {
    vi.useFakeTimers();
    
    render(
      <Alert
        type="success"
        message="Test message"
        isOpen={true}
        onClose={mockOnClose}
        autoClose={true}
        autoCloseTime={1000}
      />
    );
    
    expect(mockOnClose).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(1000);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    
    vi.useRealTimers();
  });

  it('should not auto close when autoClose is false', () => {
    vi.useFakeTimers();
    
    render(
      <Alert
        type="success"
        message="Test message"
        isOpen={true}
        onClose={mockOnClose}
        autoClose={false}
      />
    );
    
    vi.advanceTimersByTime(10000);
    
    expect(mockOnClose).not.toHaveBeenCalled();
    
    vi.useRealTimers();
  });
});