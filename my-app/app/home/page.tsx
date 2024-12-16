'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import RestaurantCard from '../components/RestaurantCard';
import SearchBar from '../components/SearchBar';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Query de busca

  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await fetch('./api/restaurants');
      const data = await res.json();
      setRestaurants(data);
    };

    fetchRestaurants();
  }, []);

  // Filtra restaurantes com base no nome ou descrição
  const filteredRestaurants = useMemo(() => {
    if (!searchQuery) return restaurants; // Se não houver busca, retorna tudo
    return restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, restaurants]);

  // Mensagem para exibir quando não há resultados
  const searchMessage =
    searchQuery && filteredRestaurants.length === 0
      ? `Nenhum resultado encontrado para "${searchQuery}".`
      : '';

  const handleSearch = (query: string) => {
    setSearchQuery(query); // Atualiza o estado da query de busca
  };

  const handleRestaurantClick = (restaurant: any) => {
    localStorage.setItem('restaurant', JSON.stringify(restaurant));
    router.push('/restaurante');
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Restaurantes Disponíveis</h1>
      <SearchBar onSearch={handleSearch} searchMessage={searchMessage} />
      <div className={styles.cardGrid}>
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant._id}
            restaurant={restaurant}
            onClick={() => handleRestaurantClick(restaurant)}
          />
        ))}
        {filteredRestaurants.length === 0 && (
          <p className={styles.noResults}>
            Nenhum restaurante encontrado.
          </p>
        )}
      </div>
    </main>
  );
};

export default Home;
