import React from "react";

export default function PopupWithForm({
  name,
  title,
  children,
  isOpen,
  onClose,
  onSubmit,
  button,
}) {
  return (
    <div className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button
          className="popup__close-button"
          type="button"
          aria-label="Закрыть всплывающее окно"
          onClick={onClose}
        ></button>
        <h2 className="popup__title">{title}</h2>
        <form
          className={`popup__form popup__edit-form_${name}`}
          name={`form-${name}`}
          onSubmit={onSubmit}
          noValidate
        >
          {children}
          <button
            className="popup__save-button"
            type="submit"
            aria-label="Сохранение изменений"
          >
            {button}
          </button>
        </form>
      </div>
    </div>
  );
}
