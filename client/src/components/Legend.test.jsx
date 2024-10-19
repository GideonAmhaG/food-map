import React from 'react';
import { render, screen } from '@testing-library/react';
import Legend from './Legend';

describe('Legend', () => {
  it('renders legend title for country data', () => {
    render(<Legend selectedData="country" />);
    expect(screen.getByText('COUNTRY Legend')).toBeInTheDocument();
  });

  it('renders legend items for IPC data', () => {
    render(<Legend selectedData="ipc" />);
    expect(screen.getByText('IPC 1 - Minimal')).toBeInTheDocument();
    expect(screen.getByText('IPC 5 - Famine')).toBeInTheDocument();
  });

  it('renders no legend items for unknown data type', () => {
    render(<Legend selectedData="unknown" />);
    expect(screen.getByText('UNKNOWN Legend')).toBeInTheDocument();
    expect(screen.queryByText('IPC 1 - Minimal')).not.toBeInTheDocument();
  });
});