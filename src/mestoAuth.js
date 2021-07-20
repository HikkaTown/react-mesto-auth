const BASE_URL = 'https://auth.nomoreparties.co';

function _responseValid(res) {
  return  res.ok ? res.json() : Promise.reject(`${res.status}`);
};


export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({password: password, email: email})
  })
  .then((res) => _responseValid(res))
  
};

export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({password: password, email: email})
  })
  .then((res) => _responseValid(res))
};

export const userInfo = () => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${localStorage.getItem('token')}` 
    }
  })
  .then((res) => _responseValid(res))
};