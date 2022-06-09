import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test( 'renders an h2', () => {
  const {getByText} = render(<App />)
  const h2 = dgetByText(/Webmaster/);
  expect(h2).toHaveTextContent("Webmaster")
})