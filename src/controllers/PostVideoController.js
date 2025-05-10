import { useState, useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import { getFirestore, doc, setDoc, updateDoc, arrayUnion } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { useUser } from '../contexts/UserContext';

const usePostVideoController = (route, navigation) => {
  const [videoPath, setVideoPath] = useState(route.params?.videoPath || '');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoPortrait, setIsVideoPortrait] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useUser();

  const dummyUsers = [
    { id: '@user1', image: 'assets/images/profile1.png' },
    { id: '@user2', image: 'assets/images/profile2.png' },
    { id: '@user3', image: 'assets/images/profile3.png' },
    { id: '@user4', image: 'assets/images/profile4.png' },
    { id: '@user5', image: 'assets/images/profile5.png' },
    { id: '@user6', image: 'assets/images/profile6.png' },
  ];

  useEffect(() => {
    getCurrentLocation();
    setIsVideoPortrait(true);
  }, []);

  const getCurrentLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          alert('Location permission denied');
          return;
        }
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationName = await reverseGeocode(latitude, longitude);
          setLocation(locationName);
        },
        (error) => {
          console.log('Location error:', error);
          alert(`Failed to get location: ${error.message}`);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
      );
    } catch (err) {
      console.warn(err);
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'MyReactNativeApp/1.0 (contact@myapp.com)',
            'Accept': 'application/json',
          },
        }
      );
      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.village || '';
      const country = data.address.country || '';
      return `${city}, ${country}`;
    } catch (error) {
      console.log('Reverse geocode error:', error);
      return 'Unknown Location';
    }
  };

  const addHashtag = (tag) => {
    if (tag.startsWith('#') && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }
  };

  const removeHashtag = (tag) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const addMention = (username) => {
    if (username.startsWith('@') && !mentions.includes(username)) {
      setMentions([...mentions, username]);
      setDescription(`${description} ${username}`.trim());
    }
  };

  const removeMention = (username) => {
    setMentions(mentions.filter((m) => m !== username));
    setDescription(description.replace(username, '').trim());
  };

  const updateMentionSuggestions = (input) => {
    const query = input.toLowerCase().replace('@', '');
    const suggestions = dummyUsers.filter(
      (user) => user.id.toLowerCase().includes(query) && !mentions.includes(user.id)
    );
    setMentionSuggestions(suggestions);
  };

  const clearMentionSuggestions = () => {
    setMentionSuggestions([]);
  };

  const postVideo = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    console.log('Current user from auth:', currentUser);
    console.log('User from context:', user);

    if (!currentUser) {
      console.log('No authenticated user found, navigating to SignIn');
      navigation.navigate('SignIn');
      return;
    }

    if (!videoPath) {
      alert('No video selected');
      setIsLoading(false);
      return;
    }


    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Upload video to Cloudinary
      const formData = new FormData();
      formData.append('file', {
        uri: `file://${videoPath}`,
        type: 'video/mp4',
        name: `${currentUser.uid}_video.mp4`,
      });
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'drwhka2v6');
      formData.append('api_key', '892343994781167');

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.cloudinary.com/v1_1/drwhka2v6/video/upload', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = ((event.loaded/2) / event.total) * 100;
          console.log("Data uploaded is ", event.loaded/2, " and total data is ", event.total);
          setUploadProgress(progress);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.error) {
            alert(`Upload failed: ${data.error.message}`);
            setIsLoading(false);
            return;
          }

          const videoUrl = data.secure_url;
          const db = getFirestore();
          const videoId = `${currentUser.uid}_${Date.now()}`;

          // Create video document with location
          await setDoc(doc(db, 'videos', videoId), {
            url: videoUrl,
            likes: 0,
            comments: 0,
            caption: description,
            hashtags: hashtags,
            mentions: mentions,
            location: location || 'Unknown Location',
            moderation_report: {},
            userId: currentUser.uid,
            createdAt: new Date(),
          });

          // Update user's posts array
          const userRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userRef, {
            posts: arrayUnion(videoId),
          });

          console.log('Video posted successfully, navigating to Home');
          setIsLoading(false);
          navigation.navigate('MainTabs', {
            screen: 'Home'
          });
        } else {
          alert(`Upload failed: ${xhr.statusText}`);
          setIsLoading(false);
        }
      };

      xhr.onerror = () => {
        alert('Upload failed: Network error');
        setIsLoading(false);
      };

      xhr.send(formData);
    } catch (error) {
      console.error('Post video error:', error);
      alert(`Failed to post video: ${error.message}`);
      setIsLoading(false);
    }
  };

  const cancel = () => {
    navigation.goBack();
  };

  return {
    videoPath,
    description,
    setDescription,
    location,
    hashtags,
    mentions,
    mentionSuggestions,
    isLoading,
    isVideoPortrait,
    uploadProgress,
    addHashtag,
    removeHashtag,
    addMention,
    removeMention,
    updateMentionSuggestions,
    clearMentionSuggestions,
    postVideo,
    cancel,
  };
};

export default usePostVideoController;