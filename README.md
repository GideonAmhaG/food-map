# Global Food Security Map with Africa Focus

This project is a work in progress. Features are being developed, and the application may not be fully functional yet. Please check back for updates.

This project is a React-based web application that visualizes food security indicators globally, with a special focus on African countries. It uses Leaflet for map rendering and displays data from multiple sources.

## Features

- Interactive world map with detailed data for African countries
- Visualization of different food security indicators:
  - Country risk scores
  - Integrated Phase Classification (IPC)
  - Food Consumption Score (FCS)
  - Climate risk
  - Hazards
- Color-coded map based on selected indicator
- Tooltips with detailed information for each country
- Legend explaining the color coding
- Sidebar for additional controls and information
- Fallback display for countries without geographical data
- Jest testing for components and functions

## Project Structure

The main components of the project are:

1. `MapComponent`: The core component that renders the map and handles data visualization.
2. `Legend`: Displays the legend for the current selected data.
3. `LoadingSpinner`: Shows a loading indicator while data is being fetched.
4. `Sidebar`: Provides additional controls and information.

The data fetching and processing are handled in the `api.js` file, which includes functions to retrieve various types of data from external APIs.

## Setup and Running the Project

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Run tests:
   ```
   npm test
   ```

## Data Sources

- Country information: HungerMap API
- Country coordinates: REST Countries API
- Africa shape data: Local GeoJSON file

## Technologies Used

- React
- Leaflet (react-leaflet)
- Axios for API requests
- Jest for testing

## Testing

The project includes Jest tests for components and functions. Run the tests using the command provided in the Setup section.

## Future Improvements

- Implement caching for API responses to reduce load times
- Add more detailed data visualizations for non-African countries
- Improve error handling and user feedback
- Expand test coverage

## Contributing

Contributions are welcome. Please open an issue to discuss proposed changes or submit a pull request.

## Authors

- [Your Name]
- [Other Contributors]

## License

This project is licensed under the MIT License.
