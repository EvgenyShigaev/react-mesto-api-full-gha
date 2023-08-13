import React, { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const handleClick = () => onCardClick(card);
  const handleLikeClick = () => onCardLike(card);
  const handleDeleteClick = () => onCardDelete(card);

  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((i) => i._id === currentUser._id);
  const cardLikeButtonClassName = `element__like ${
    isLiked && "element__like_active"
  }`;

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <li className="element">
        {isOwn && (
          <button
            className="element__delete-button"
            type="button"
            onClick={handleDeleteClick}
            aria-label="Удалить"
          ></button>
        )}
        <img
          className="element__image"
          src={card.link}
          alt={card.name}
          onClick={handleClick}
        />
        <div className="element__container">
          <h2 className="element__text">{card.name}</h2>
          <div className="element__counter-box">
            <button
              className={cardLikeButtonClassName}
              type="button"
              onClick={handleLikeClick}
              aria-label="Лайк"
            ></button>
            <p className="element__like-counter">{card.likes.length}</p>
          </div>
        </div>
      </li>
    </CurrentUserContext.Provider>
  );
}
