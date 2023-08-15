class Api {
  constructor({ url, headers}) {
    this._url = url;
    this._headers = headers;
  }

  _getJson(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  _setHeaders() { 
    const token = localStorage.getItem("token"); 
    return { 
      Authorization: `Bearer ${token}`, 
      ...this._headers, 
    }; 
  } 
// ----
  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      method: "GET",
      headers: this._setHeaders(),
    }).then(this._getJson);
  }

  getUserData() {
    return fetch(`${this._url}/users/me`, {
      headers: this._setHeaders(),
    }).then(this._getJson);
  }
// ---
  editUserInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: this._setHeaders(),
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then(this._getJson);
  }

  editUserAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: this._setHeaders(),
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(this._getJson);
  }

  addCard(data) {
    return fetch(`${this._url}/cards`, { 
      method: "POST", 
      headers: this._setHeaders(), 
      body: JSON.stringify({ 
        name: data.name, 
        link: data.link, 
      }), 
    }).then(this._getJson); 
  }

  deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
      method: "DELETE",
      headers: this._setHeaders(),
    }).then(this._getJson);
  }

  addLike(id) {
    return fetch(`${this._url}/cards/${id}/likes`, {
      method: "PUT",
      headers: this._setHeaders(),
    }).then(this._getJson);
  }
  
  deleteLike(id, token) {
    return fetch(`${this._url}/cards/${id}/likes`, {
      method: "DELETE",
      headers: this._setHeaders(),
    }).then(this._getJson);
  }

  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      return this.addLike(cardId);
    } else {
      return this.deleteLike(cardId);
    }
  }
}

export const api = new Api({
  url: "https://api.mesto-frontend.nomoreparties.co",
  headers: { 
    Accept: "application/json", 
    "Content-type": "application/json", 
  }, 
});