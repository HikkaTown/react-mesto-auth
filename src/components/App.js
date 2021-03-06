import React, { useState, useEffect, useCallback } from 'react';
import { Redirect, Route, Switch, useHistory, withRouter } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import CurrentUserContext from '../contexts/CurrentUserContext';
import api from '../utils/api';
import Header from './Header';
import Main from './Main';
import PopupConfirm from './PopupConfirm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup.js';
import Footer from './Footer';
import ProtectedRoute from './ProtectedRoute';
import * as mestoAuth from '../mestoAuth.js';
import InfoTooltip from './InfoTooltip';
function App() {
  useEffect(() => {
    api.getUserInfo()
      .then(res => {
        setCurrentUser({
          name: res.name, 
          about: res.about,
          avatar: res.avatar,
          _id: res._id
        });
      })
      .catch((e) => console.log(`Ошибка - ${e}`));
  }, []);
  const [cardData, setCardData] = useState('');
  const [cards, setInitialCards] = React.useState([]);
  React.useEffect(() => {
    api.getInitialCards()
      .then(
        res => {setInitialCards(res)}
      )
      .catch((e) => console.log(`Ошибка -${e}`))
  }, []);
  const [isEditProfilePopupOpen, setEditProfile] = useState(false);
  const [isAddPlacePopupOpen, setAddPlace] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatar] = useState(false);
  const [isConfirmPopupOpen, setConfirmPopup] = useState(false);
  const [selectCard, setSelectCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    name: 'DefaultName',
    about: 'DefaultDescroption',
    avatar: null,
    _id: null
  });

  function handleLikeCard(card) {
    const isLiked = card.likes.some(owner => owner._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setInitialCards((state) => state.map((c) => c._id === card._id ? newCard : c))
      })
      .catch((e) => console.log(`Ошибка - ${e}`))
  }
  function handleUpdateUser(user, about) {
    api.setUserData(user, about)
      .then(newUserData => {
        setCurrentUser({
          name: newUserData.name,
          about: newUserData.about,
          avatar: newUserData.avatar,
          _id: newUserData._id
        });
        closeAllPopups()
      })
      .catch((e) => console.log(`Ошибка - ${e}`))
  }
  function handleUpdateAvatar(link) {
    api.setUserAvatar(link)
      .then(newUserData => {
        setCurrentUser({
          name: newUserData.name,
          about: newUserData.about,
          avatar: newUserData.avatar,
          _id: newUserData._id
        });
        closeAllPopups();
      })
      .catch((e) => console.log(`Ошибка - ${e}`))
  }
  function handleAddPlaceSubmit(name, link) {
    api.addCard(name, link)
      .then(newCard => {
        setInitialCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((e) => console.log(`Ошибка - ${e}`))
  }
  function handleCardClick(data) {
    setOverflowPage();
    setSelectCard(data);
  }

  function setOverflowPage() {
    document.body.classList.toggle('overflow-hidden');
  }
  
  function closeAllPopups() {
    setEditProfile(false);
    setAddPlace(false);
    setEditAvatar(false);
    setSelectCard(null);
    setConfirmPopup(false)
    setInfoTooltipePopup(false)
    setOverflowPage();
  }

  function handleEditAvatar() {
    setOverflowPage();
    setEditAvatar(!isEditAvatarPopupOpen);
  }
  function handleEditPopup() {
    setOverflowPage();
    setEditProfile(!isEditProfilePopupOpen);
  }
  function handleAddPlacePopup() {
    setOverflowPage();
    setAddPlace(!isAddPlacePopupOpen)
  }
  function handleDeletCard(card) {
    setConfirmPopup(true)
    setOverflowPage();
    setCardData(card);
  }
  function handleConfirmSubmit(card) {
     api.removeCard(card._id)
      .then(res => {
        setInitialCards((state) => state.filter(element => element._id !== card._id));
        setConfirmPopup(false)
        setOverflowPage();
        setCardData('');
      })
      .catch((e) => console.log(`Ошибка - ${e}`))
  }
  const [loggedIn, setLoggedIn] = useState(false);
  function handleLogin(e) {
    tokenCheck();
  }
  const history = useHistory();
  const tokenCheck = useCallback(() => {
    const token = localStorage.getItem('token');
    if(token) {
      mestoAuth.userInfo()
        .then(res => {
          setLoggedIn(true);
          localStorage.setItem('user', JSON.stringify({
            _id: res.data._id,
            email: res.data.email
          }));
          history.push('/');
        })
        .catch((err) => console.log(`Ошибка ${err}`))
    }
  }, [history])

  useEffect(() => {
    tokenCheck();
  }, [tokenCheck]);

  const [isInfoToolipePopup, setInfoTooltipePopup] = useState(false);
  const [typeMessage, setTypeMessage] = useState(false);

  function handleInfoTooltipePopup(value) {
    setInfoTooltipePopup(true);
    setTypeMessage(value);
    setOverflowPage();
  }

  function handleSubmitLogin(email, password) {
    mestoAuth.login(email, password)
      .then((res) => {
        localStorage.setItem('token', res.token);
        handleLogin();
      })
      .catch((err) => {
        handleInfoTooltipePopup(false);
        console.log(`Ошибка - ${err}`);
      });
  }

  function handleSubmitRegister(email, password) {
    mestoAuth.register(email, password)
      .then((data) => {
        if(data) {
          handleInfoTooltipePopup(true);
        } else {
          console.log('Что-то пошло не так!');
        }
      })
      .catch((err) => {
        console.log(`Ошибка - ${err}`);
        handleInfoTooltipePopup(false);
      });
  }


  return (
    <>
    <CurrentUserContext.Provider value={currentUser}>
      <Header setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>
      <Switch>
        
        <Route exact={true} path="/sign-in">
          <Login handleSubmitLogin={handleSubmitLogin}/>
        </Route>
        <Route exact={true} path="/sign-up">
          <Registration handleSubmitRegister={handleSubmitRegister} />
        </Route>
        <ProtectedRoute
          path="/"
          exact={true}
          loggedIn={loggedIn}
          onEditProfile={handleEditPopup} 
          onAddPlace={handleAddPlacePopup} 
          onEditAvatar={handleEditAvatar}
          onCardClick={handleCardClick}
          onCardLike={handleLikeCard}
          onCardDelete={handleDeletCard}
          cardList={cards}
          component={Main}
        />
        <Route exact={true} path="/">
          {loggedIn ? (
          <Redirect to="/"/>
          ) : (
          <Redirect to="/sign-in"/>
          )}
        </Route>
      </Switch>
      <ImagePopup card={selectCard} onClose={closeAllPopups}/>
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
      <PopupConfirm 
        isOpen={isConfirmPopupOpen}
        onClose={closeAllPopups}
        cardData={cardData}
        onSubmit={handleConfirmSubmit}
      />
      <InfoTooltip
        isOpen={isInfoToolipePopup}
        typeMessage={typeMessage}
        onClose={closeAllPopups}
        name='info'
      />
      {loggedIn ? <Footer /> : ""}
      </CurrentUserContext.Provider>
    </>
  );
}

export default withRouter(App);
