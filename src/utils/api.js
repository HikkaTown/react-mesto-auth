class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }
  // проверка ответа
  _responseValid(res) {
    return  res.ok ? res.json() : Promise.reject(`${res.status}`);
  }
  // получаем все карточки
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers
    })
    .then(res =>  this._responseValid(res))
  }
  // получаем информаццию юзера
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers
    })
    .then(res =>  this._responseValid(res))
  }
  // Записываем данные на сервер
  setUserData(name, description) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: description
      })
    })
    .then(res =>  this._responseValid(res))
  }
  // Сохраняем аватар пользователя
  setUserAvatar(link) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: link
      })
    })
    .then(res =>  this._responseValid(res))
  }
  // Добавление карточки
  addCard(name, link) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link
      })
    })
    .then(res =>  this._responseValid(res))
  }

  removeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    })
    .then(res =>  this._responseValid(res))
  }

  changeLikeCardStatus(cardId, isLiked) {
    if(isLiked) {
      return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
        method: 'DELETE',
        headers: this._headers,
      })
      .then(res =>  this._responseValid(res))
    } else {
      return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
        method: 'PUT',
        headers: this._headers
      })
      .then(res =>  this._responseValid(res))
    }
  }
}



const api = new Api({baseUrl: "https://mesto.nomoreparties.co/v1/cohort-24", headers: {
  authorization: '175aa685-14cc-4995-ab2c-72df36e470f5',
  'Content-Type': 'application/json'
  }}
);

export default api;