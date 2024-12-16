'use client';

import React, { useEffect, useState } from 'react';
import MenuCard from "../components/menuCard/MenuCard";
import RestaurantInformations from "../components/restaurantInformations/RestaurantInformations";
import styles from './Restaurant.module.css';
import { FaTrashAlt } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import SearchBar from '../components/SearchBar';

const RestaurantPage = () => {
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const { user } = useUser();
  const [order, setOrder] = useState<any[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Armazena a busca
  const [searchMessage, setSearchMessage] = useState(''); // Mensagem de resultado da busca

  useEffect(() => {
    const storedRestaurant = localStorage.getItem('restaurant');
    if (storedRestaurant) {
      setRestaurant(JSON.parse(storedRestaurant));
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query); // Define o estado da busca
    setSearchMessage(query ? `Resultados para: "${query}"` : ''); // Atualiza mensagem
  };

  const handleConfirmOrder = (item: any) => {
    setOrder((prevOrder) => {
      const existingItemIndex = prevOrder.findIndex((orderItem) => orderItem.name === item.name);

      if (existingItemIndex !== -1) {
        const updatedOrder = [...prevOrder];

        if (item.quantity < 1) {
          updatedOrder.splice(existingItemIndex, 1);
        } else {
          updatedOrder[existingItemIndex].quantity = item.quantity;
        }

        return updatedOrder;
      }

      return [...prevOrder, item];
    });
  };

  const ConfirmOrder = async () => {
    const orderId = `order-${new Date().getTime()}`;
    const email = user?.email;

    const totalPrice = order.reduce((sum, item) => sum + formatPrice(item.price) * item.quantity, 0);

    const orderData = {
      orderId,
      email,
      restaurant: restaurant.name,
      price: totalPrice,
      items: order.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: formatPrice(item.price),
      })),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
      const data = await response.json();

      if (data) {
        alert("Pedido confirmado!");
        toggleOrderModal();
      }
    } catch (error) {
      console.error("Erro ao confirmar pedido:", error);
      alert("Erro ao confirmar o pedido.");
    }
  };

  const toggleOrderModal = () => setShowOrderModal((prev) => !prev);
  const formatPrice = (price: string) => parseFloat(price.replace('R$', '').replace(',', '.').trim());
  const totalPrice = order.reduce((sum, item) => sum + formatPrice(item.price) * item.quantity, 0);

  if (!restaurant) return <div></div>;

  // Filtrando itens do menu com base na busca, tanto pelo nome quanto pela descrição
  const filterMenuItems = (items: any[]) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <main className={styles.container}>
      <RestaurantInformations restaurant={restaurant} />

      <SearchBar onSearch={handleSearch} searchMessage={searchMessage} />

      <section className={styles.menu}>
        <h2>Menu</h2>
        {searchMessage && <p className={styles.searchMessage}>{searchMessage}</p>}
        {['destaque', 'pratos', 'bebidas'].map((category) => (
          restaurant.menu[category] && restaurant.menu[category].length > 0 && (
            <div key={category} className={styles.menuCategory}>
              <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              <div className={styles.menuSection}>
                {filterMenuItems(restaurant.menu[category]).map((item: any) => (
                  <MenuCard
                    key={item.name}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    image={item.image}
                    onConfirmOrder={(quantity: number) => handleConfirmOrder({ ...item, quantity })}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </section>

      <div className={styles.cartIcon} onClick={toggleOrderModal}>
        <img src="/bag-icon.png" alt="Carrinho" className={styles.icon} />
        <span className={styles.cartTotal}>R$ {totalPrice.toFixed(2)}</span>
      </div>

      {showOrderModal && (
        <div className={styles.modalBackdrop} onClick={toggleOrderModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Seu Pedido</h2>
              <button className={styles.closeButton} onClick={toggleOrderModal}>X</button>
            </div>
            <p>Taxa de entrega: {restaurant.price}</p>
            {order.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <ul className={styles.itemList}>
                {order.map((item, index) => (
                  <li key={index} className={styles.item}>
                    <span>{item.name}</span>
                    <span>R$ {(formatPrice(item.price) * item.quantity).toFixed(2)}</span>
                    <button 
                      className={styles.quantityButton} 
                      onClick={() => handleConfirmOrder({ ...item, quantity: item.quantity - 1 })}
                      disabled={item.quantity < 1}
                    >
                      {item.quantity === 1 ? <FaTrashAlt /> : "-"}
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      className={styles.quantityButton} 
                      onClick={() => handleConfirmOrder({ ...item, quantity: item.quantity + 1 })}
                    >
                      +
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.modalFooter}>
              <span className={styles.totalPrice}>
                Total: R$ {(totalPrice + ((totalPrice > 0) ? formatPrice(restaurant.price) : 0)).toFixed(2)}
              </span>
              <button className={styles.confirmButton} onClick={ConfirmOrder}>
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default RestaurantPage;
