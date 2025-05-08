import { useState, useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';
import useAuthController from './AuthController';
import { PermissionsAndroid } from 'react-native';

const usePostVideoController = (route, navigation) => {
  const [videoPath, setVideoPath] = useState(route.params?.videoPath || '');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoPortrait, setIsVideoPortrait] = useState(true);
  const { user } = useAuthController();

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
    // In RN, we can't easily determine video orientation; assuming portrait for now
    setIsVideoPortrait(true);
  }, []);

  const getCurrentLocation = async () => {
    try {
      // Request location permission (Android)
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          alert('Location permission denied');
          return;
        }
      }
  
      // Get current coordinates
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Coords:', latitude, longitude);
  
          // Now reverse geocode
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
       { headers: {
        'User-Agent': 'MyReactNativeApp/1.0 (contact@myapp.com)', 
          'Accept': 'application/jsonv2'  
        }  }  
      );

      console.log(latitude);
      console.log(longitude);
  
      
      const data = await response.json();
      console.log('Geocode response:', data); 
  
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
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const addMention = (username) => {
    if (username.startsWith('@') && !mentions.includes(username)) {
      setMentions([...mentions, username]);
      setDescription(`${description} ${username}`.trim());
    }
  };

  const removeMention = (username) => {
    setMentions(mentions.filter(m => m !== username));
    setDescription(description.replace(username, '').trim());
  };

  const updateMentionSuggestions = (input) => {
    const query = input.toLowerCase().replace('@', '');
    const suggestions = dummyUsers.filter(user =>
      user.id.toLowerCase().includes(query) && !mentions.includes(user.id)
    );
    setMentionSuggestions(suggestions);
  };

  const clearMentionSuggestions = () => {
    setMentionSuggestions([]);
  };

  const postVideo = () => {
    if (!user) {
      navigation.navigate('SignIn');
      return;
    }
    // TODO: Implement video posting logic
    navigation.goBack();
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