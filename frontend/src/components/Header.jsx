import React from "react";
import headerLogo from "../images/logo.svg";
import { Link, Route, Routes } from "react-router-dom";

export default function Header({ email, logout }) {
  return (
    <header className="header">
      <img
        className="header__logo"
        src={headerLogo}
        alt='Логотип "Место Россия"'
      />

      <Routes>
        <Route
          path="/sign-in"
          element={
            <Link to="/sign-up" className="header__auth">
              Регистрация
            </Link>
          }
        ></Route>
        <Route
          path="/sign-up"
          element={
            <Link to="/sign-in" className="header__auth">
              Войти
            </Link>
          }
        />

        <Route
          path="/"
          element={
            <div className="header__auth-container">
              <p className="header__auth-email">{email}</p>
              <Link
                to="/sign-in"
                className="header__auth header__auth-signin"
                onClick={logout}
              >
                Выйти
              </Link>
            </div>
          }
        />
      </Routes>
    </header>
  );
}