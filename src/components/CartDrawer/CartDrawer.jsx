import axios from 'axios';
import React, { useState } from 'react';

import Info from '../Info/Info';
import { useCart } from '../../hooks/useCart';

import styles from './CartDrawer.module.scss';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CartDrawer = ({ onClose, onRemove, items = [], opened }) => {
  const { cartItems, setCartItems, totalPrice } = useCart();
  const [orderId, setOrderId] = useState(null);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        'https://621f7736ce99a7de193d4f2c.mockapi.io/orders',
        { items: cartItems }
      );
      setOrderId(data.id);
      setIsOrderCompleted(true);
      setCartItems([]);

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete(
          'https://621f7736ce99a7de193d4f2c.mockapi.io/Cart/' + item.id
        );
        await delay(1000);
      }
    } catch (error) {
      alert('Не удалось создать заказ:C');
    }
    setIsLoading(false);
  };

  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisilbe : ''}`}>
      <div className={styles.drawer}>
        <h2 className="mb-20 d-flex justify-between ">
          Корзина{' '}
          <img
            onClick={onClose}
            className="removeBtn cu-p"
            src="/img/btn-remove.svg"
            alt="Remove"
          />
        </h2>

        {items.length > 0 ? (
          <div className="d-flex flex-column flex">
            <div className="items ">
              {items.map((obj) => (
                <div
                  key={obj.id}
                  className="cartItem d-flex align-center mb-20"
                >
                  <div
                    style={{ backgroundImage: `url(${obj.imgUrl})` }}
                    className="cartItemImg"
                  ></div>
                  <div className="mr-20 flex">
                    <p className="mb-5">{obj.title}</p>
                    <b>{obj.price}</b>
                  </div>
                  <img
                    onClick={() => onRemove(obj.id)}
                    className="removeBtn"
                    src="/img/btn-remove.svg"
                    alt="Remove"
                  />
                </div>
              ))}
            </div>
            <div className="cartTotalBlock">
              <ul>
                <li>
                  <span>Итого</span>
                  <div></div>
                  <b>{totalPrice} руб.</b>
                </li>

                <li>
                  <span>Налог 5 %</span>
                  <div></div>
                  <b>{Math.round((totalPrice / 100) * 5)} руб.</b>
                </li>
              </ul>
              <button
                disabled={isLoading}
                onClick={onClickOrder}
                className="greenButton"
              >
                Оформить заказ <img src="/img/arrow.svg" alt="Arrow" />
              </button>
            </div>
          </div>
        ) : (
          <Info
            title={isOrderCompleted ? 'Заказ оформлен!' : 'Корзина пустая'}
            description={
              isOrderCompleted
                ? `Ваш заказ #${orderId} скоро будет передан курьеской доставке`
                : ' Добавьте хотя бы одну пару кроссовок,чтобы сделать заказ'
            }
            image={
              isOrderCompleted
                ? '/img/complete-oreder.png'
                : '/img/cart-empty.png'
            }
          />
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
