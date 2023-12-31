import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/Api";
import { Login } from "./Login";
import { Register } from "./Register";
import { InfoTooltip } from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth.js";
import PopupWithSubmit from "./PopupWithSubmit";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isInfoTooltip, setIsInfoTooltip] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [isPopupWithSubmit, setIsPopupWithSubmit] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // пользователь, карточки, токен, логин и рег
  useEffect(() => {
    if (loggedIn) {
      api
        .getUserData()
        .then((res) => {
          setCurrentUser(res.data);
        })
        .catch((err) => {
          console.log(`Ошибка: ${err.status}`);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      api
        .getInitialCards()
        .then((data) => {
          setCards(data.reverse());
        })
        .catch((err) => {
          console.log(`Ошибка: ${err.status}`);
        });
    }
  }, [loggedIn]);

  function checkToken() {
    const token = localStorage.getItem("token");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          if (res.data) {
            setLoggedIn(true);
            setEmail(res.data.email);
            navigate("/", { replace: true });
          }
        })
        .catch((err) => {
          console.log(`Ошибка: ${err.status}`);
        });
    }
  }

  useEffect(() => {
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // регистрация
  function handleRegister({ email, password }) {
    auth
      .register(email, password)
      .then((res) => {
        console.log(res);
        setIsSuccess(true);
        navigate("/sign-in", { replace: true });
      })
      .catch((err) => {
        setIsSuccess(false);
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setIsInfoTooltip(true));
  }
  // вход
  function handleLogin({ email, password }) {
    auth
      .login(email, password)
      .then((data) => {
        if (data.token) {
          console.log(data);
          setEmail(email);
          localStorage.setItem("token", data.token);
          setLoggedIn(true);

          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        setIsSuccess(false);
        setIsInfoTooltip(true);
        console.log(`Ошибка: ${err}`);
      });
  }
  // выход
  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setEmail("");
    navigate("/sign-in", { replace: true });
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsPopupWithSubmit(false);
    setIsInfoTooltip(false);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleCardDeleteConfirm(card) {
    setIsPopupWithSubmit(true);
    setSelectedCard(card);
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => alert(err));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => alert(err));
  }

  function handleUpdateUser(value) {
    api
      .editUserInfo(value)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => alert(err));
  }

  function handleUpdateAvatar(value) {
    api
      .editUserAvatar(value)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => alert(err));
  }

  function handleAddPlaceSubmit(card) {
    api
      .addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => alert(err));
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header logout={handleLogout} email={email} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                onUpdateUser={handleUpdateUser}
                cards={cards}
                onCardDeleteConfirm={handleCardDeleteConfirm}
                loggedIn={loggedIn}
              />
            }
          />

          <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />

          <Route
            path="/sign-up"
            element={<Register onRegister={handleRegister} />}
          />

          <Route
            path="*"
            element={
              loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
            }
          />
        </Routes>
        {loggedIn && <Footer />}

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <ImagePopup
          card={selectedCard}
          isOpen={Boolean(isImagePopupOpen)}
          onClose={closeAllPopups}
        ></ImagePopup>

        <PopupWithSubmit
          isOpen={isPopupWithSubmit}
          onClose={closeAllPopups}
          card={selectedCard}
          onCardDelete={handleCardDelete}
        ></PopupWithSubmit>

        <InfoTooltip
          isOpen={isInfoTooltip}
          onClose={closeAllPopups}
          isSuccess={isSuccess}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
