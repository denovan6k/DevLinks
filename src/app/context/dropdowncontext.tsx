
"use client";
import React, { createContext, useState, useContext } from 'react';
import user, { Linkx }  from '../(mobile)/linkdata/data';
 // Replace with your actual menu data
interface DropdownContextType {
  selectedOption: Linkx;
  
  options: Linkx[]; // Assuming linkx is defined from your mobiledata/page.tsx
  isOpen: boolean;
  activeDropdownId: string | null;
  setActiveDropdownId: (id: string | null) => void;

  handleOptionSelect: (option: Linkx) => void;
  
}

const DropdownContext = createContext<DropdownContextType | null>(null);

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdownContext must be used within a DropdownProvider');
  }
  return context;
};

export const DropdownProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedOption, setSelectedOption] = useState<Linkx>(user[0]); // Initial selected option
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const handleOptionSelect = (option: Linkx) => {
    setSelectedOption(option);
    setIsOpen(false);
  };


  const value = {
    selectedOption,
    options: user, // Assuming user is defined from your menu.tsx
    isOpen,
    handleOptionSelect,
   
    activeDropdownId,
  setActiveDropdownId,
  };

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  );
};

export default DropdownContext;

