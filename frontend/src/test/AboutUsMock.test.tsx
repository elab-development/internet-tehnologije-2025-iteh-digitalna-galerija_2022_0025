import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AboutUs from '../components/AboutUs';
import { vi } from 'vitest';


const mockFilterTeamByDepartment = vi.fn();

describe('AboutUs component', () => {
  afterEach(() => {
    vi.clearAllMocks(); 
  });

  test('Prikazuje sve članove tima na početku', () => {
    const { getByText } = render(<AboutUs />);
    
    // Provera da li su svi članovi tima prikazani na početku
    expect(getByText('Jana Ostojić')).toBeInTheDocument();
    expect(getByText('Kristina Pantelić')).toBeInTheDocument();
    expect(getByText('Emilija Nikolić')).toBeInTheDocument();
  });

  test('Filtrira članove tima po departmanu kada se klikne na dugme', () => {
    const { getAllByText } = render(<AboutUs filterTeamByDepartment={mockFilterTeamByDepartment} />);
    
    // Klik na prvo dugme za filtriranje po Marketingu
    const marketingButtons = getAllByText('Marketing');
    fireEvent.click(marketingButtons[0]);
    
    // Provera da li je mock funkcija filterTeamByDepartment pozvana sa odgovarajućim argumentom
    expect(mockFilterTeamByDepartment).toHaveBeenCalledWith('Marketing');
  });
});
