import React, { useState, useEffect, useContext } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="profile"
      button="Сохранить"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="popup__form" name="profile_form" noValidate>
        <input
          className="popup__input"
          id="name-input"
          type="text"
          name="name"
          placeholder="Ваше имя"
          minLength="2"
          maxLength="40"
          required
          onChange={(evt) => setName(evt.target.value)}
          value={name ?? ""}
        />
        <span className="popup__input-error name-input-error"></span>
        <input
          className="popup__input"
          id="job-input"
          type="text"
          name="job"
          placeholder="Ваш вид деятельности"
          minLength="2"
          maxLength="200"
          required
          onChange={(evt) => setDescription(evt.target.value)}
          value={description ?? ""}
        />
        <span className="popup__input-error job-input-error"></span>
      </div>
    </PopupWithForm>
  );
}
