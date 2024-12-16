'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import styles from './OrdersPage.module.css'; // Importa o arquivo CSS

const OrdersPage = () => {
  const { user, isLoading } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?email=${user.email}`);
        const data = await response.json();

        if (data.message) {
          setMessage(data.message); 
        } else {
          setOrders(data); 
        }
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        setMessage('Erro ao carregar pedidos.');
      }
    };

    fetchOrders();
  }, [user, isLoading]);

  if (isLoading) return <p>Carregando...</p>;
  if (!user) return <p>Você precisa estar logado para ver seus pedidos.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Meus Pedidos</h1>

      {message && <p className={styles.message}>{message}</p>}

      {orders.length === 0 && !message ? (
        <p className={styles.noOrders}>Nenhum pedido encontrado.</p>
      ) : (
        <ul className={styles.orderList}>
          {orders.map((order, index) => (
            <li key={index} className={styles.orderItem}>
              <h2 className={styles.restaurantName}>{order.restaurant}</h2>
              <p className={styles.price}>Preço: R$ {order.price}</p>
              <h3 className={styles.itemsHeading}>Itens:</h3>
              <ul className={styles.itemsList}>
                {order.items.map((item: any, idx: number) => (
                  <li key={idx} className={styles.item}>
                    <span>{item.name} - Quantidade: {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
