import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';

import AppContext from './context';

import CartDrawer from './components/CartDrawer/CartDrawer';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import { Orders } from './pages/Orders';

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [cartOpened, setCartOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [cartRespons, favoritesRespons, itemsRespons] = await Promise.all(
          [
            axios.get('https://621f7736ce99a7de193d4f2c.mockapi.io/Cart'),
            axios.get('https://621f7736ce99a7de193d4f2c.mockapi.io/favorites'),
            axios.get('https://621f7736ce99a7de193d4f2c.mockapi.io/items'),
          ]
        );

        setIsLoading(false);

        setCartItems(cartRespons.data);
        setFavorites(favoritesRespons.data);
        setItems(itemsRespons.data);
      } catch (error) {
        alert('Ошибка при запросе данных');
        console.error(error);
      }
    }

    fetchData();
  }, []);
  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find(
        (item) => Number(item.parentId) === Number(obj.id)
      );
      if (findItem) {
        setCartItems((prev) =>
          prev.filter((item) => Number(item.parentId) !== Number(obj.id))
        );
        await axios.delete(
          `https://621f7736ce99a7de193d4f2c.mockapi.io/Cart/${findItem.id}`
        );
      } else {
        setCartItems((prev) => [...prev, obj]);
        const { data } = await axios.post(
          'https://621f7736ce99a7de193d4f2c.mockapi.io/Cart',
          obj
        );
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.parentId === data.parentId) {
              return {
                ...item,
                id: data.id,
              };
            }
            return item;
          })
        );
      }
    } catch (error) {
      alert('Не получилось добавить в корзину');
      console.error(error);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(
          `https://621f7736ce99a7de193d4f2c.mockapi.io/favorites/${obj.id}`
        );
        setFavorites((prev) =>
          prev.filter((item) => Number(item.id) !== Number(obj.id))
        );
      } else {
        const { data } = await axios.post(
          'https://621f7736ce99a7de193d4f2c.mockapi.io/favorites',
          obj
        );
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не получается добавить в избранное');
      console.error(error);
    }
  };
  const onRemoveItem = async (id) => {
    try {
      axios.delete(`https://621f7736ce99a7de193d4f2c.mockapi.io/Cart/${id}`);
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(id))
      );
    } catch (error) {
      alert('Ошибка при удалении из корзины');
      console.error(error);
    }
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        setCartOpened,
        setCartItems,
        onAddToCart,
      }}
    >
      <div className="wrapper clear">
        <div>
          <CartDrawer
            items={cartItems}
            onClose={() => setCartOpened(false)}
            onRemove={onRemoveItem}
            opened={cartOpened}
          />
        </div>
        <Header onClickCart={() => setCartOpened(true)} />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isLoading={isLoading}
                cartItems={cartItems}
                items={items}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFavorite={onAddToFavorite}
                onAddToCart={onAddToCart}
              />
            }
          />

          <Route path="/favorites" element={<Favorites />} />

          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
