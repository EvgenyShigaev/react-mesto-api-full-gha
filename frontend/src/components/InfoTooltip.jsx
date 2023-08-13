import React from "react";
import tooltipSuccess from "../images/TooltipSuccess.png";
import tooltipError from "../images/TooltipError.png";

export function InfoTooltip({ onClose, isOpen, isSuccess }) {
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="tooltip__container">
        <button
          className="popup__close-button"
          type="button"
          aria-label="Закрытие всплывающего окна"
          onClick={onClose}
        ></button>
        <img
          className="tooltip__image"
          src={isSuccess ? tooltipSuccess : tooltipError}
          alt="Сообщение о результате регистрации/авторизации"
        />
        <h2 className={`tooltip__text`}>
          {isSuccess
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте еще раз."}
        </h2>
      </div>
    </div>
  );
}
