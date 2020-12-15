import {v4 as uuid} from 'uuid';

import firebase from '../config/firebase';

export const handleAvatar = async (fileImage) => {
  const file = fileImage.target.files[0];
  const id = uuid();
  const handleImage = firebase.storage().ref('avatar').child(id);
  await handleImage.put(file);
  handleImage.getDownloadURL().then(url => {
    return url;
  })
};