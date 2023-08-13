import React from "react";

export default function ImagePopup({ onClose, isOpen, card }) {
  return (
    <div
      className={`popup popup_dark-background ${isOpen ? "popup_opened" : ""}`}
    >
      <figure className="popup__photo-container">
        <button
          className="popup__close-button"
          type="button"
          aria-label="Закрытие всплывающего окна"
          onClick={onClose}
        ></button>
        <img className="popup__photo" src={card.link} alt={card.name} />
        <figcaption className="popup__photo-caption">{card.name}</figcaption>
      </figure>
    </div>
  );
}
