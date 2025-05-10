import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
import { useUser } from '../contexts/UserContext';

const useUserMediaController = () => {
  const { user } = useUser();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.posts?.length > 0) {
      fetchVideos();
    } else {
      setVideos([]);
    }
  }, [user]);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const db = getFirestore();
      const videoPromises = user.posts.map(async (videoId) => {
        const videoRef = doc(db, 'videos', videoId);
        const videoSnap = await getDoc(videoRef);
        if (videoSnap.exists()) {
          const data = videoSnap.data();
          // Generate thumbnail URL by transforming Cloudinary video URL
          const thumbnailUrl = data.url.replace('/upload/', '/upload/f_jpg,so_0/');
          return {
            id: videoId,
            url: data.url,
            thumbnailUrl,
            views: data.views || 0, // Default to 0 if views field is missing
            caption: data.caption,
            location: data.location,
            userId: data.userId,
          };
        }
        return null;
      });

      const videoResults = await Promise.all(videoPromises);
      setVideos(videoResults.filter((video) => video !== null));
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert(`Failed to load videos: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    videos,
    isLoading,
  };
};

export default useUserMediaController;