import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import usePostVideoController from '../../controllers/PostVideoController';
import AppTheme from '../../utils/Theme';

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

  return (
    <View style={styles.container}>
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
            {hashtags.map(tag => (
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
        <TextInput
          style={styles.input}
          placeholder="Mention someone (e.g., @user1)"
          placeholderTextColor="gray"
          onChangeText={(value) => {
            if (value.endsWith('@') || (value.includes('@') && value.split(' ').pop().startsWith('@'))) {
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
        {mentionSuggestions.length > 0 && (
          <FlatList
            data={mentionSuggestions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
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
            )}
            style={styles.suggestionList}
          />
        )}
        {mentions.length > 0 && (
          <View style={styles.chipContainer}>
            {mentions.map(mention => (
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
    </View>
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
  suggestionList: {
    maxHeight: 200,
    backgroundColor: AppTheme.secondaryBlack,
    borderRadius: 8,
    marginTop: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  suggestionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  suggestionText: {
    color: 'white',
    marginLeft: 8,
    fontFamily: 'Poppins',
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