import React from 'react';

export default function Registration(props) {
  return(
    <div className="auth">
      <form
        className="auth__form auth__form_type_login"
        name="sign-up"
      >
        <h2 className="auth__title">Регистрация</h2>
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
        <button className="auth__submit" type="submit">Зарегестрироваться</button>
        <p className="auth__subtitle">Уже зарегестрированы? <button className="auth__button">Войти</button></p>
      </form>
    </div>
  )
}