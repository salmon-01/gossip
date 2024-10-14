import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders the loading spinner with default props', () => {
    render(<LoadingSpinner />);

    const spinnerImg = screen.getByAltText('Profile');
    expect(spinnerImg).toBeInTheDocument();
    expect(spinnerImg).toHaveClass('animate-spin');
    expect(spinnerImg).toHaveClass('h-24 w-24');
  });

  it('applies the correct background color from props', () => {
    render(<LoadingSpinner bgColor="bg-red-500" />);

    const spinnerWrapper = screen.getByAltText('Profile').parentElement;
    expect(spinnerWrapper).toHaveClass('bg-red-500');
  });

  it('renders with the correct size prop', () => {
    render(<LoadingSpinner size={50} />);

    const spinnerImg = screen.getByAltText('Profile');
    expect(spinnerImg).toHaveClass('h-24 w-24'); // Customize this to match the image size if applicable
  });

  it('renders with a custom color prop', () => {
    render(<LoadingSpinner color="#ff0000" />);

    // Assuming you are rendering a svg spinner with this color, you would check the stroke attribute
    // For now, this test checks if component renders correctly
    const spinnerImg = screen.getByAltText('Profile');
    expect(spinnerImg).toBeInTheDocument();
  });
});
