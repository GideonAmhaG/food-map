import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
  it('renders all data type options', () => {
    render(<Sidebar setSelectedData={() => {}} />);
    expect(screen.getByText('Country Information')).toBeInTheDocument();
    expect(screen.getByText('IPC Data')).toBeInTheDocument();
    expect(screen.getByText('Food Consumption Score')).toBeInTheDocument();
    expect(screen.getByText('Climate Data')).toBeInTheDocument();
    expect(screen.getByText('Hazards Data')).toBeInTheDocument();
  });

  it('calls setSelectedData when an option is clicked', () => {
    const mockSetSelectedData = jest.fn();
    render(<Sidebar setSelectedData={mockSetSelectedData} />);
    fireEvent.click(screen.getByText('IPC Data'));
    expect(mockSetSelectedData).toHaveBeenCalledWith('ipc');
  });
});