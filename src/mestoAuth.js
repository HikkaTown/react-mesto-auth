const BASE_URL = 'https://auth.nomoreparties.co';

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({password: password, email: email})
  })
  .then((res) => {return  res.ok ? res.json() : Promise.reject(`${res.status}`);})
  
};

export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({password: password, email: email})
  })
  .then((response) => {
    try {
      if(response.status === 200) {
        return response.json();
      }
    } catch(e) {
      return (e)
    }
  })
  .then((res) => {
    return res;
  })
  .catch((err) => console.log(`Ошибка ${err}`))
};

export const userInfo = () => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${localStorage.getItem('token')}` 
    }
  })
  .then((response) => {
    try {
      if(response.status === 200) {
        return response.json();
      }
    } catch(e) {
      return (e)
    }
  })
  .then((res) => {
    return res;
  })
  .catch((err) => console.log(`Ошибка - ${err}`))
};