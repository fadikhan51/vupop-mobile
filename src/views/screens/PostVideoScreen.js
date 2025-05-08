import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import usePostVideoController from '../../controllers/PostVideoController';
import AppTheme from '../../utils/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const PostVideoScreen = ({ route, navigation }) => {
  const {
    videoPath,
    description,
    setDescription,
    location,
    hashtags,
    mentions,
    mentionSuggestions,
    addHashtag,
    removeHashtag,
    addMention,
    removeMention,
    updateMentionSuggestions,
    clearMentionSuggestions,
    postVideo,
    cancel,
  } = usePostVideoController(route, navigation);

  const mentionInputRef = useRef(null);
  const [dropdownTop, setDropdownTop] = useState(0);

  const handleInputLayout = () => {
    if (mentionInputRef.current) {
      mentionInputRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownTop(pageY + height + 4); // Position just below input with small gap
      });
    }
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => {
        addMention(item.id);
        clearMentionSuggestions();
      }}
    >
      <Image
        source={require('../../../assets/images/profile1.png')}
        style={styles.suggestionImage}
      />
      <Text style={styles.suggestionText}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={cancel}>
          <Icon name="close" size={28} color={AppTheme.primaryYellow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity onPress={postVideo}>
          <Text style={styles.shareButton}>Share</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.previewSection}>
          {videoPath ? (
            <Video
              source={{ uri: videoPath }}
              style={styles.videoPreview}
              resizeMode="cover"
              repeat={true}
              muted={false}
            />
          ) : (
            <View style={styles.videoPlaceholder}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            placeholderTextColor="gray"
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <Text style={styles.sectionTitle}>Hashtags</Text>
        <TextInput
          style={styles.input}
          placeholder="Add a hashtag (e.g., #travel)"
          placeholderTextColor="gray"
          onSubmitEditing={(e) => {
            const value = e.nativeEvent.text;
            if (value) {
              addHashtag(value);
              e.target.clear();
            }
          }}
        />
        {hashtags.length > 0 && (
          <View style={styles.chipContainer}>
            {hashtags.map((tag) => (
              <View key={tag} style={styles.chip}>
                <Text style={styles.chipText}>{tag}</Text>
                <TouchableOpacity onPress={() => removeHashtag(tag)}>
                  <Icon name="close" size={16} color={AppTheme.primaryYellow} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.sectionTitle}>Mentions</Text>
        <View style={styles.mentionInputContainer}>
          <TextInput
            ref={mentionInputRef}
            onLayout={handleInputLayout}
            style={styles.input}
            placeholder="Mention someone (e.g., @user1)"
            placeholderTextColor="gray"
            onChangeText={(value) => {
              handleInputLayout(); // Recalculate position on text change
              if (
                value.endsWith('@') ||
                (value.includes('@') && value.split(' ').pop().startsWith('@'))
              ) {
                const lastWord = value.split(' ').pop();
                if (lastWord.startsWith('@')) {
                  updateMentionSuggestions(lastWord);
                }
              } else {
                clearMentionSuggestions();
              }
            }}
            onSubmitEditing={(e) => {
              const value = e.nativeEvent.text;
              if (value) {
                addMention(value);
                e.target.clear();
              }
            }}
          />
        </View>
        {mentions.length > 0 && (
          <View style={styles.chipContainer}>
            {mentions.map((mention) => (
              <View key={mention} style={styles.chip}>
                <Text style={styles.chipText}>{mention}</Text>
                <TouchableOpacity onPress={() => removeMention(mention)}>
                  <Icon name="close" size={16} color={AppTheme.primaryYellow} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.sectionTitle}>Location</Text>
        <TouchableOpacity style={styles.locationContainer}>
          <Icon name="location-on" size={20} color={AppTheme.primaryYellow} />
          <Text style={styles.locationText}>
            {location || 'Add location'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {mentionSuggestions.length > 0 && (
        <View style={[styles.suggestionListContainer, { top: dropdownTop }]}>
          <FlatList
            data={mentionSuggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={(item) => item.id}
            style={styles.suggestionList}
            contentContainerStyle={styles.suggestionListContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.primaryBlack,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    color: AppTheme.primaryYellow,
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  shareButton: {
    color: AppTheme.primaryYellow,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  content: {
    padding: 16,
  },
  previewSection: {
    flexDirection: 'row',
  },
  videoPreview: {
    width: 100,
    height: 150,
    borderRadius: 12,
    backgroundColor: AppTheme.secondaryBlack,
  },
  videoPlaceholder: {
    width: 100,
    height: 150,
    borderRadius: 12,
    backgroundColor: AppTheme.secondaryBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: AppTheme.primaryYellow,
  },
  captionInput: {
    flex: 1,
    marginLeft: 16,
    padding: 12,
    backgroundColor: AppTheme.secondaryBlack + '80',
    borderRadius: 12,
    color: 'white',
    fontFamily: 'Poppins',
    fontSize: 16,
  },
  sectionTitle: {
    color: AppTheme.primaryYellow,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: AppTheme.secondaryBlack + '80',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontFamily: 'Poppins',
    fontSize: 14,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.secondaryBlack,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: AppTheme.primaryYellow,
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  mentionInputContainer: {
    position: 'relative',
  },
  suggestionListContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    maxHeight: 200,
    backgroundColor: AppTheme.secondaryBlack,
    borderRadius: 12, // Softer corners for minimalistic look
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, // Subtle shadow for minimalism
    shadowRadius: 4,
  },
  suggestionList: {
    flexGrow: 0,
  },
  suggestionListContent: {
    paddingVertical: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10, // Slightly larger padding for cleaner look
    paddingHorizontal: 12,
  },
  suggestionImage: {
    width: 36, // Slightly smaller for minimalism
    height: 36,
    borderRadius: 18,
  },
  suggestionText: {
    color: 'white',
    marginLeft: 10,
    fontFamily: 'Poppins',
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.secondaryBlack + '80',
    borderRadius: 8,
    padding: 12,
  },
  locationText: {
    color: 'white',
    marginLeft: 8,
    fontFamily: 'Poppins',
    fontSize: 14,
  },
});

export default PostVideoScreen;