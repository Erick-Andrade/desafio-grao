'use client';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from '../styles/SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void; // Callback para enviar a busca
  searchMessage?: string; // Mensagem dinâmica da busca (opcional)
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchMessage }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Envia a busca para o componente pai
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <button type="submit" className={styles.searchButton}>
          <FaSearch />
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Busque por restaurante ou item"
          className={styles.searchInput}
        />
      </form>
      {searchMessage && (
        <p className={styles.searchMessage}>{searchMessage}</p>
      )}
    </div>
  );
};

export default SearchBar;
