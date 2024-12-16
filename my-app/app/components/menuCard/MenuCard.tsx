"use client";

import React, { useState } from "react";
import styles from "./MenuCard.module.css";

interface MenuCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
  onConfirmOrder: (quantity: number) => void; // Nova prop para confirmar pedido
}

const MenuCard: React.FC<MenuCardProps> = ({ name, description, price, image, onConfirmOrder }) => {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setQuantity(1); // Reseta a quantidade ao fechar o modal
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1)); // Evita negativos

  const handleConfirm = () => {
    onConfirmOrder(quantity); // Passa a quantidade confirmada para o restaurante
    handleCloseModal();
  };

  return (
    <>
      <div className={styles.menuCard} onClick={handleOpenModal}>
        <img src={image} alt={name} className={styles.menuCardImage} />
        <h3 className={styles.menuCardTitle}>{name}</h3>
        <p className={styles.menuCardDescription}>{description}</p>
        <p className={styles.menuCardPrice}>{price}</p>
      </div>

      {showModal && (
        <div className={styles.modalBackdrop} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={image} alt={name} className={styles.modalImage} />
            <h3 className={styles.modalTitle}>{name}</h3>
            <p className={styles.modalDescription}>{description}</p>
            <p className={styles.modalPrice}>{price}</p>

            <div className={styles.quantityControl}>
              <button className={styles.quantityButton} onClick={decreaseQuantity}>-</button>
              <span className={styles.quantityValue}>{quantity}</span>
              <button className={styles.quantityButton} onClick={increaseQuantity}>+</button>
            </div>

            <div className={styles.modalButtons}>
              <button className={styles.closeButton} onClick={handleCloseModal}>Fechar</button>
              <button className={styles.confirmButton} onClick={handleConfirm}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuCard;
