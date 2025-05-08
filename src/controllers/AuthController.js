import { useState, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged 
} from '@react-native-firebase/auth';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  serverTimestamp 
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import FirebaseService from '../services/FirebaseService';
import { AppRoutes } from '../utils/Constants';

const useAuthController = (navigation) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isHidePassword, setIsHidePassword] = useState(true);
  const [isUserExist, setIsUserExist] = useState(false);
  const [showOtherFields, setShowOtherFields] = useState(false);
  const [termAndConditionAccepted, setTermAndConditionAccepted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const emailRules = {
    validFormat: false,
    notEmpty: false,
  };
  const passwordRules = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  };
  const usernameRules = {
    minLength: false,
    maxLength: false,
    noSpaces: false,
    noSpecialChars: false,
  };

  useEffect(() => {
    const app = getApp();
    const authInstance = getAuth(app);

    const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await FirebaseService.getUserData(firebaseUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const isValid = emailRegex.test(email);
    emailRules.validFormat = isValid;
    emailRules.notEmpty = email.length > 0;
    setIsValidEmail(isValid && email.length > 0);
    return isValid;
  };

  const validatePassword = (password) => {
    passwordRules.minLength = password.length >= 8;
    passwordRules.hasUpperCase = /[A-Z]/.test(password);
    passwordRules.hasLowerCase = /[a-z]/.test(password);
    passwordRules.hasNumber = /[0-9]/.test(password);
    passwordRules.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return Object.values(passwordRules).every(rule => rule);
  };

  const validateUsername = (username) => {
    usernameRules.minLength = username.length >= 3;
    usernameRules.maxLength = username.length <= 20;
    usernameRules.noSpaces = !username.includes(' ');
    usernameRules.noSpecialChars = !/[!@#$%^&*(),.?":{}|<>]/.test(username);
    return Object.values(usernameRules).every(rule => rule);
  };

  const checkUsernameAvailable = async (username) => {
    const app = getApp();
    const db = getFirestore(app);

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const app = getApp();
      const db = getFirestore(app);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.trim().toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setIsUserExist(true);
        setShowOtherFields(false);
      } else {
        setIsUserExist(false);
        setShowOtherFields(true);
      }
    } catch (e) {
      alert(`Error checking email: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async () => {
    if (!validatePassword(password)) {
      alert('Please enter a valid password');
      return;
    }

    setIsLoading(true);
    try {
      const firebaseUser = await FirebaseService.signIn(email.trim(), password);
      if (firebaseUser) {
        const userData = await FirebaseService.getUserData(firebaseUser.uid);
        setUser(userData);
        navigation.replace(AppRoutes.home);
      }
    } catch (e) {
      alert(`Login failed: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async () => {
    if (!validateUsername(username) || !validatePassword(password)) {
      alert('Please enter a valid username and password');
      return;
    }

    setIsLoading(true);
    try {
      const isUsernameAvailable = await checkUsernameAvailable(username.trim());
      if (!isUsernameAvailable) {
        alert('Username is already taken. Please choose another one.');
        return;
      }

      const firebaseUser = await FirebaseService.signUp(email.trim(), password, username.trim());
      if (firebaseUser) {
        const app = getApp();
        const db = getFirestore(app);

        // Create UserModel-compatible Firestore document
        const userData = {
          uid: firebaseUser.uid,
          email: email.trim().toLowerCase(),
          username: username.trim(),
          createdAt: serverTimestamp(),
          profilePicture: '',
          bio: '',
          passions: [],
          requests: [],
          friends: [],
          posts: [],
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), userData);

        const fetchedUserData = await FirebaseService.getUserData(firebaseUser.uid);
        setUser(fetchedUserData);
        navigation.replace(AppRoutes.home);
      }
    } catch (e) {
      alert(`Registration failed: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await FirebaseService.signOut();
      setUser(null);
    } catch (e) {
      alert(`Failed to sign out: ${e.message}`);
    }
  };

  const launchTermsAndPrivacyUrl = async () => {
    alert('Terms and Privacy URL not implemented in this environment');
  };

  return {
    user,
    isLoading,
    isLoadingGoogle,
    isValidEmail,
    isHidePassword,
    setIsHidePassword,
    isUserExist,
    showOtherFields,
    termAndConditionAccepted,
    setTermAndConditionAccepted,
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    emailRules,
    passwordRules,
    usernameRules,
    validateEmail,
    validatePassword,
    validateUsername,
    handleEmailSubmit,
    loginUser,
    registerUser,
    signOut,
    launchTermsAndPrivacyUrl,
  };
};

export default useAuthController;