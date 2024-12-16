import React from 'react';
import styles from './RestaurantInformations.module.css';

interface RestaurantProps {
  restaurant: {
    name: string;
    description: string;
    rating: string;
    time: string;
    price: string;
    phone: string;
    banner: string;
    logo: string;
    address: {
      street: string;
      city: string;
      zipCode: string;
    };
  };
}

const RestaurantInformations: React.FC<RestaurantProps> = ({ restaurant }) => {
  return (
    <div className={styles.container}>
      {/* Banner e logo */}
      <div className={styles.banner}>
        <img
          src={restaurant.banner}
          alt={`${restaurant.name} Banner`}
          className={styles.bannerImage}
        />
        <img
          src={restaurant.logo}
          alt={`${restaurant.name} Logo`}
          className={styles.logoImage}
        />
      </div>

      {/* Informações do restaurante */}
      <section className={styles.info}>
        <h1 className={styles.name}>{restaurant.name}</h1>
        <p className={styles.description}>{restaurant.description}</p>

        <div className={styles.details}>
          <div className={styles.detail}>
            <strong>Avaliação:</strong> {restaurant.rating}
          </div>
          <div className={styles.detail}>
            <strong>Tempo de Entrega:</strong> {restaurant.time}
          </div>
          <div className={styles.detail}>
            <strong>Taxa de entrega:</strong> {restaurant.price}
          </div>
          <div className={styles.detail}>
            <strong>Telefone:</strong> {restaurant.phone}
          </div>
          <div className={styles.detail}>
            <strong>Endereço:</strong> {`${restaurant.address.street}, ${restaurant.address.city} - ${restaurant.address.zipCode}`}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RestaurantInformations;
