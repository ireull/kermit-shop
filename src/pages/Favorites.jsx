import React, { useContext } from 'react';

import { Card } from '../components/Card/Card';
import AppContext from '../context';

const Favorites = () => {
  const { favorites, onAddToFavorite } = useContext(AppContext);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои закладки</h1>
      </div>

      <div className="d-flex flex-wrap mb-30">
        {favorites.map((item, index) => (
          <Card
            key={index}
            favorited={true}
            addFavorite={onAddToFavorite}
            {...item}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
