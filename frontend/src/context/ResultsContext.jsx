import { createContext, useContext, useState } from 'react';

const ResultsContext = createContext();

export function ResultsProvider({ children }) {
  const [results, setResults] = useState(null);

  return (
    <ResultsContext.Provider value={{ results, setResults }}>
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
}
