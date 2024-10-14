import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import AddComment from './AddComment';

describe('AddComment component', () => {
  test('renders input field and submit button', () => {
    render(<AddComment onAddComment={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Comment');
    const buttonElement = screen.getByRole('button', { name: /post/i });

    expect(inputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  test('updates input value as user types', () => {
    render(<AddComment onAddComment={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Comment');

    fireEvent.change(inputElement, { target: { value: 'Test comment' } });
    expect(inputElement).toHaveValue('Test comment');
  });

  test('calls onAddComment with the comment when submitted with non-empty comment', () => {
    const onAddCommentMock = vi.fn();
    render(<AddComment onAddComment={onAddCommentMock} />);

    const inputElement = screen.getByPlaceholderText('Comment');
    const buttonElement = screen.getByRole('button', { name: /post/i });

    fireEvent.change(inputElement, { target: { value: 'Test comment' } });
    fireEvent.click(buttonElement);

    expect(onAddCommentMock).toHaveBeenCalledTimes(1);
    expect(onAddCommentMock).toHaveBeenCalledWith('Test comment');
  });

  test('does not call onAddComment when submitted with empty comment', () => {
    const onAddCommentMock = vi.fn();
    render(<AddComment onAddComment={onAddCommentMock} />);

    const inputElement = screen.getByPlaceholderText('Comment');
    const buttonElement = screen.getByRole('button', { name: /post/i });

    // Test with empty string
    fireEvent.change(inputElement, { target: { value: '' } });
    fireEvent.click(buttonElement);
    expect(onAddCommentMock).not.toHaveBeenCalled();

    // Test with whitespace-only string
    fireEvent.change(inputElement, { target: { value: '   ' } });
    fireEvent.click(buttonElement);
    expect(onAddCommentMock).not.toHaveBeenCalled();
  });

  test('clears input after successful submission', () => {
    const onAddCommentMock = vi.fn();
    render(<AddComment onAddComment={onAddCommentMock} />);

    const inputElement = screen.getByPlaceholderText('Comment');
    const buttonElement = screen.getByRole('button', { name: /post/i });

    fireEvent.change(inputElement, { target: { value: 'Test comment' } });
    fireEvent.click(buttonElement);

    expect(inputElement).toHaveValue('');
  });
});
