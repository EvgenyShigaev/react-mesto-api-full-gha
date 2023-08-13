import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [placeName, setPlaceName] = useState("");
  const [placeLink, setPlaceLink] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name: placeName,
      link: placeLink,
    });
  }

  useEffect(() => {
    setPlaceName("");
    setPlaceLink("");
  }, [isOpen]);

  return (
    <PopupWithForm
      title="Новое место"
      name="place"
      button="Создать"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="popup__form" name="cards_form" noValidate>
        <input
          className="popup__input"
          id="place-input"
          type="text"
          name="place"
          placeholder="Название"
          minLength="2"
          maxLength="30"
          required
          value={placeName ?? ""}
          onChange={(e) => setPlaceName(e.target.value)}
        />
        <span className="popup__input-error place-input-error"></span>
        <input
          className="popup__input"
          id="link-input"
          type="url"
          name="link"
          placeholder="Ссылка на картинку"
          required
          value={placeLink ?? ""}
          onChange={(e) => setPlaceLink(e.target.value)}
        />
        <span className="popup__input-error link-input-error"></span>
      </div>
    </PopupWithForm>
  );
}
