import React, { useState } from "react";
import { Link } from "react-router-dom";

export function Register({ onRegister }) {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onRegister(formValue);
  }

  return (
    <div className="auth">
      <p className="auth__title">Регистрация</p>
      <form
        onSubmit={handleSubmit}
        className={"auth__form"}
        name="register"
        method="POST"
      >
        <input
          className="auth__input"
          placeholder="Email"
          id="email"
          name="email"
          type="email"
          required
          value={formValue.email}
          onChange={handleChange}
        />

        <input
          className="auth__input"
          placeholder="Пароль"
          id="password"
          name="password"
          type="password"
          required
          value={formValue.password}
          onChange={handleChange}
        />

        <button className="auth__button" type="submit">
          Зарегистрироваться
        </button>
      </form>

      <p className="auth__signin-title">
        Уже зарегистрированы?
        <Link to="login" className="auth__link">
          Войти
        </Link>
      </p>
    </div>
  );
}
