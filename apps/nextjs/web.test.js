/*global test, expect, beforeAll, jest, describe */
/*eslint no-undef: "error"*/

import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = {
  userAgent: 'node.js',
};

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SideNav from './dashboard/components/side-nav';

jest.mock('next/link', () => ({ children }) => children); // Mocking the Next.js Link component

describe('SideNav component', () => {
  beforeAll(() => {
    // Set up a basic DOM structure before running the tests
    const div = document.createElement('div');
    div.setAttribute('id', 'root');
    document.body.appendChild(div);
  });

  test('renders without crashing', () => {
    render(<SideNav />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
    expect(screen.getByText('Distributors')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  test('toggles open/close when arrow button is clicked', () => {
    render(<SideNav />);
    const arrowButton = screen.getByTestId('arrow-button');

    fireEvent.click(arrowButton);
    expect(arrowButton).toHaveClass('rotate-180');

    fireEvent.click(arrowButton);
    expect(arrowButton).not.toHaveClass('rotate-180');
  });

  test('displays submenu when "Update" menu is clicked', () => {
    render(<SideNav />);
    const updateMenu = screen.getByText('Update');

    fireEvent.click(updateMenu);

    expect(screen.getByText('By Item')).toBeInTheDocument();
    expect(screen.getByText('By Calculator')).toBeInTheDocument();
  });

  
});
