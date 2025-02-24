import { useState, useEffect } from 'react';

const MAX_HISTORY_ITEMS = 5;

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addToHistory = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== searchTerm);
      return [searchTerm, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return {
    searchHistory,
    addToHistory,
    clearHistory
  };
};
