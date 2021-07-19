import React from 'react';
import * as mestoAuth from '../mestoAuth.js';
import {Link, withRouter} from 'react-router-dom';
class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const {name, value} = e.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    mestoAuth.register(this.state.email, this.state.password)
      .then((data) => {
        if(data) {
          this.setState({
            message: ''
          }, () => {
            this.props.InfoTooltipOpen(true);
          })
        } else {
          this.setState({
            message: 'Что-то пошло не так!'
          });
        }
      })
      .catch((err) => {
        console.log(`Ошибка - ${err}`);
        this.props.InfoTooltipOpen(false)
      });
    }
  render() {
    return(
      <div className="auth">
        <form
          className="auth__form auth__form_type_login"
          name="sign-up"
          onSubmit={this.handleSubmit}
        >
          <h2 className="auth__title">Регистрация</h2>
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
          <button className="auth__submit" type="submit">Зарегестрироваться</button>
          <p className="auth__subtitle">Уже зарегестрированы? <Link to="/sign-in" className="auth__button">Войти</Link></p>
        </form>
      </div>
    )
  }
}

export default withRouter(Registration);