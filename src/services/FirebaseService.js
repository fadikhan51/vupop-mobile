import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import UserModel from '../models/UserModel';

const signUp = async (email, password, username) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (e) {
    throw e;
  }
};

const signIn = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (e) {
    throw e;
  }
};

const signInWithGoogle = async () => {
  // Google Sign-In is more complex in RN; we'll skip this for now as it requires additional setup
  throw new Error('Google Sign-In not implemented');
};

const checkUserExists = async (email) => {
  try {
    const methods = await auth().fetchSignInMethodsForEmail(email);
    return methods.length > 0;
  } catch (e) {
    console.log('Check user exists error:', e);
    return false;
  }
};

const signOut = async () => {
  try {
    await auth().signOut();
  } catch (e) {
    throw e;
  }
};

const getCurrentUser = () => {
  return auth().currentUser;
};

const getUserData = async (uid) => {
  try {
    const doc = await firestore().collection('users').doc(uid).get();
    if (doc.exists) {
      return new UserModel(doc.data());
    }
    return null;
  } catch (e) {
    throw e;
  }
};

export default {
  signUp,
  signIn,
  signInWithGoogle,
  checkUserExists,
  signOut,
  getCurrentUser,
  getUserData
};