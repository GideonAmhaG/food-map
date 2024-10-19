import React from 'react';
import { render, screen } from '@testing-library/react';
import MapComponent from './Map';
import { getCountryInfo } from '../services/api';

// Mock the API calls
jest.mock('../services/api');

describe('MapComponent', () => {
  it('renders map container', () => {
    render(<MapComponent selectedData="country" />);
    const mapElement = screen.getByRole('region');
    expect(mapElement).toBeInTheDocument();
  });

  it('displays loading spinner when fetching data', () => {
    getCountryInfo.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<MapComponent selectedData="country" />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays error message when API call fails', async () => {
    getCountryInfo.mockRejectedValue(new Error('API Error'));
    render(<MapComponent selectedData="country" />);
    const errorMessage = await screen.findByText(/Failed to fetch data/);
    expect(errorMessage).toBeInTheDocument();
  });
});