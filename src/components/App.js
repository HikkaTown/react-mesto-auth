import React, { useState, useEffect } from 'react';

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
  return (
    <>
    <CurrentUserContext.Provider value={currentUser}>
      <Header />
      <Main 
        onEditProfile={handleEditPopup} 
        onAddPlace={handleAddPlacePopup} 
        onEditAvatar={handleEditAvatar}
        onCardClick={handleCardClick}
        onCardLike={handleLikeCard}
        onCardDelete={handleDeletCard}
        cardList={cards}
      />
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
      <Footer />
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
