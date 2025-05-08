import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import UserModel from '../models/UserModel';

class FirebaseService {
  async signUp(email, password, username) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (e) {
      throw e;
    }
  }

  async signIn(email, password) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (e) {
      throw e;
    }
  }

  async signInWithGoogle() {
    // Google Sign-In is more complex in RN; we'll skip this for now as it requires additional setup
    throw new Error('Google Sign-In not implemented');
  }

  async checkUserExists(email) {
    try {
      const methods = await auth().fetchSignInMethodsForEmail(email);
      return methods.length > 0;
    } catch (e) {
      console.log('Check user exists error:', e);
      return false;
    }
  }

  async signOut() {
    try {
      await auth().signOut();
    } catch (e) {
      throw e;
    }
  }

  getCurrentUser() {
    return auth().currentUser;
  }

  async getUserData(uid) {
    try {
      const doc = await firestore().collection('users').doc(uid).get();
      if (doc.exists) {
        return new UserModel(doc.data());
      }
      return null;
    } catch (e) {
      throw e;
    }
  }
}

export default new FirebaseService();