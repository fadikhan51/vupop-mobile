import { getApp } from '@react-native-firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail, signOut as firebaseSignOut } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
import UserModel from '../models/UserModel';

const app = getApp();
const authInstance = getAuth(app);
const firestoreInstance = getFirestore(app);

const signUp = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  } catch (e) {
    throw e;
  }
};

const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  } catch (e) {
    throw e;
  }
};

const signInWithGoogle = async () => {
  throw new Error('Google Sign-In not implemented');
};

const checkUserExists = async (email) => {
  try {
    const methods = await fetchSignInMethodsForEmail(authInstance, email);
    return methods.length > 0;
  } catch (e) {
    console.log('Check user exists error:', e);
    return false;
  }
};

const signOut = async () => {
  try {
    await firebaseSignOut(authInstance);
  } catch (e) {
    throw e;
  }
};

const getCurrentUser = () => {
  return authInstance.currentUser;
};

const getUserData = async (uid) => {
  try {
    const userDocRef = doc(firestoreInstance, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return new UserModel(docSnap.data());
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
