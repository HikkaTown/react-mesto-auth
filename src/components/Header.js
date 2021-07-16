import React from 'react';
import logo from '../images/logo.svg';

function Header() {
  return (
  <header className="header">
    <img src={logo} alt="Mesto" className="header__logo" />

    <button className="header__button">Регистрация</button>
  </header>
  );
}

export default Header