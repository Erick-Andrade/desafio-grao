"use client";

import React from "react";
import Link from "next/link"; // Importe o Link do Next.js
import styles from "../styles/RestaurantCard.module.css";
import { FaStar } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { BiMoney } from "react-icons/bi";

interface RestaurantCardProps {
  restaurant: {
    banner: string;
    logo: string;
    name: string;
    description: string;
    rating: number;
    time: string;
    price: string;
    menu: any[];  // Certifique-se de que o menu seja um array
    phone: string;
    address: any[];
  };
  onClick: () => void;  // Função para chamar ao clicar
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onClick
}) => {
  return (
    // Envolva o cartão inteiro no Link
    <div className={styles.card} onClick={onClick}>
      <div className={styles.banner}>
        <img src={restaurant.banner} alt={`${restaurant.name} banner`} className={styles.bannerImage} />
        <img src={restaurant.logo} alt={`${restaurant.name} logo`} className={styles.logoImage} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{restaurant.name}</h3>
        <span className={styles.description}>{restaurant.description}</span>
        <div className={styles.details}>
          <span>
            <FaStar className={styles.icon} /> {restaurant.rating}
          </span>
          <span>
            <MdAccessTime className={styles.icon} /> {restaurant.time}
          </span>
          <span>
            <BiMoney className={styles.icon} /> {restaurant.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RestaurantCard);
