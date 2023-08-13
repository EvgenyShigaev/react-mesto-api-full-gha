import React, { useState } from "react";

export function Login({ onLogin }) {
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
    onLogin(formValue);
  }

  return (
    <div className="auth">
      <p className="auth__title">Вход</p>
      <form
        className="auth__form"
        name="login"
        method="POST"
        onSubmit={handleSubmit}
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
          Войти
        </button>
      </form>
    </div>
  );
}
