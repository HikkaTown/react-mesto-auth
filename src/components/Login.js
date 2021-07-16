import React from 'react';

export default function Login(props) {
  return(
    <div className="auth">
      <form
        className="auth__form auth__form_type_login"
        name="sign-in"
      >
        <h2 className="auth__title">Вход</h2>
        <input
          type="text"
          placeholder="Email"
          className="auth__input"
          name="email"
        />
        <input
          type="password"
          placeholder="Пароль"
          className="auth__input"
          name="password"
        />
        <button className="auth__submit" type="submit">Войти</button>
      </form>
    </div>
  )
}