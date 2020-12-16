import {v4 as uuid} from 'uuid';
import { toast } from "react-toastify";

import firebase from '../config/firebase';

export const handleAvatar = async (fileImage) => {
  const file = fileImage.target.files[0];
  const id = uuid();
  const handleImage = firebase.storage().ref('avatar').child(id);
  await handleImage.put(file);
  const urlImage = handleImage.getDownloadURL().then(url => {
    console.tron.log('fileImage url', url);
    return url;
  })
  return urlImage;
};

export const removeAvatar = async (file) => {
  console.tron.log('removeAvatar', file);
  // const file = fileImage.target.files[0];
  const handleImage = firebase.storage().refFromURL(file);
  handleImage.delete().then(function() {
    return toast.success("Imagem deletada com sucesso!");
    ;
  })
};