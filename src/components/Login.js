import React from 'react';
import * as mestoAuth from '../mestoAuth.js';
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogin = this.props.handleLogin;
  }

  handleChange(e) {
    const {name, value} = e.target;
    this.setState({
      [name]: value
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    mestoAuth.login(this.state.email, this.state.password)
      .then((res) => {
        localStorage.setItem('token', res.token);
        this.handleLogin();
      })
      .catch((err) => {
        this.props.InfoTooltipOpen(false);
        console.log(`Ошибка - ${err}`);
      })

  }

  render() {
    return(
      <div className="auth">
      <form
        className="auth__form auth__form_type_login"
        name="sign-in"
        onSubmit={this.handleSubmit}
      >
        <h2 className="auth__title">Вход</h2>
        <input
          onChange={this.handleChange}
          type="text"
          placeholder="Email"
          className="auth__input"
          name="email"
          value={this.state.email}
        />
        <input
          onChange={this.handleChange}
          type="password"
          placeholder="Пароль"
          className="auth__input"
          name="password"
          value={this.state.password}
        />
        <button className="auth__submit" type="submit">Войти</button>
      </form>
    </div>
    )
  }
};

export default Login;