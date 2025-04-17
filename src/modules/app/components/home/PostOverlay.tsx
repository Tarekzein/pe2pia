// PostOverlay.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  Share,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import FastImage from 'react-native-fast-image';
import { BlurView } from '@react-native-community/blur';
import ImageGallery from './ImageGallary';

interface PostOverlayProps {
  visible: boolean;
  post: any;
  onClose: () => void;
  isDarkMode?: boolean;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
  onShare?: (postId: string) => void;
  currentUser?: any;
}

const { height } = Dimensions.get('window');

const PostOverlay: React.FC<PostOverlayProps> = ({
                                                   visible,
                                                   post,
                                                   onClose,
                                                   isDarkMode = false,
                                                   onLike,
                                                   onComment,
                                                   onShare,
                                                   currentUser,
                                                 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isVerticalGestureActive, setIsVerticalGestureActive] = useState(false);

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0);
      opacity.value = withSpring(1);
      scale.value = withSpring(1);
    }
  }, [visible]);

// In PostOverlay.tsx, update the vertical gesture:

  const verticalGesture = Gesture.Pan()
    .onStart(() => {
      setIsVerticalGestureActive(true);
    })
    .onUpdate((event) => {
      // Only handle vertical gestures
      if (Math.abs(event.translationY) > Math.abs(event.translationX)) {
        if (event.translationY > 0) {
          translateY.value = event.translationY;
          opacity.value = 1 - event.translationY / (height * 0.5);
          scale.value = 1 - event.translationY / (height * 2);
        }
      } else {
        // If horizontal gesture, allow image gallery to handle it
        setIsVerticalGestureActive(false);
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        translateY.value = withTiming(height, { duration: 200 });
        opacity.value = withTiming(0, { duration: 200 });
        scale.value = withTiming(0.8, { duration: 200 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(0);
        opacity.value = withSpring(1);
        scale.value = withSpring(1);
      }
      runOnJS(setIsVerticalGestureActive)(false);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const handleLike = async () => {
    if (onLike) {
      setIsLoading(true);
      try {
        await onLike(post.id);
      } catch (error) {
        console.error('Error liking post:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleComment = async () => {
    if (onComment && comment.trim()) {
      setIsLoading(true);
      try {
        await onComment(post.id, comment);
        setComment('');
      } catch (error) {
        console.error('Error posting comment:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this post by ${post.user.FirstName} ${post.user.LastName}`,
        url: post.files[0]?.url,
      });
      if (result.action === Share.sharedAction && onShare) {
        onShare(post.id);
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const renderComment = ({ item }: { item: any }) => (
    <View style={tailwind`flex-row items-start mb-4 px-4`}>
      <FastImage
        source={{ uri: item.user.avatar }}
        style={tailwind`w-8 h-8 rounded-full mr-3`}
      />
      <View style={tailwind`flex-1`}>
        <Text style={tailwind`text-white font-bold`}>
          {item.user.FirstName} {item.user.LastName}
        </Text>
        <Text style={tailwind`text-gray-300 mt-1`}>{item.text}</Text>
        <Text style={tailwind`text-gray-500 text-xs mt-1`}>
          {format(new Date(item.createdAt), 'MMM d, yyyy')}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <GestureDetector gesture={verticalGesture}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <BlurView
            style={tailwind`absolute inset-0`}
            blurType={isDarkMode ? 'dark' : 'light'}
            blurAmount={20}
          />
          <View style={tailwind`flex-1 justify-between bg-black bg-opacity-90`}>
            {/* Header */}
            <View style={tailwind`flex-row justify-between items-center p-4`}>
              <View style={tailwind`flex-row items-center`}>
                <FastImage
                  source={{ uri: post.user.avatar }}
                  style={tailwind`w-10 h-10 rounded-full mr-3`}
                />
                <View>
                  <Text style={tailwind`text-white font-bold text-lg`}>
                    {post.user.FirstName} {post.user.LastName}
                  </Text>
                  <Text style={tailwind`text-gray-400 text-xs`}>
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Icon name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            {/* Content */}
            <View style={tailwind`flex-1 justify-center`}>
              {post.files?.length > 0 && (
                <ImageGallery
                  images={post.files}
                  onIndexChange={setActiveIndex}
                  enabled={!isVerticalGestureActive}
                />
              )}

              {/* Image Indicators */}
              {post.files?.length > 1 && (
                <View style={tailwind`flex-row justify-center mt-2`}>
                  {post.files.map((_: any, index: number) => (
                    <View
                      key={index}
                      style={[
                        tailwind`w-2 h-2 rounded-full mx-1`,
                        index === activeIndex
                          ? tailwind`bg-yellow-500`
                          : tailwind`bg-gray-500`,
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* Actions */}
            <View style={tailwind`px-4 pb-4`}>
              <Text style={tailwind`text-white text-base mb-4`}>
                {post.description}
              </Text>

              <View style={tailwind`flex-row justify-between items-center mb-4`}>
                <View style={tailwind`flex-row`}>
                  <TouchableOpacity
                    style={tailwind`flex-row items-center mr-6`}
                    onPress={handleLike}
                    disabled={isLoading}>
                    <Icon
                      name={post.isLiked ? 'heart' : 'heart'}
                      size={24}
                      color={post.isLiked ? '#FEA928' : 'white'}
                    />
                    <Text style={tailwind`text-white ml-2`}>
                      {post.likes?.length || 0}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={tailwind`flex-row items-center mr-6`}
                    onPress={() => setShowComments(!showComments)}>
                    <Icon name="message-circle" size={24} color="white" />
                    <Text style={tailwind`text-white ml-2`}>
                      {post.comments?.length || 0}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={tailwind`flex-row items-center`}
                    onPress={handleShare}>
                    <Icon name="share-2" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Comments Section */}
              {showComments && (
                <View style={tailwind`mt-4`}>
                  <FlatList
                    data={post.comments}
                    renderItem={renderComment}
                    keyExtractor={(item) => item.id}
                    style={tailwind`max-h-40`}
                  />

                  <View style={tailwind`flex-row items-center mt-4`}>
                    <TextInput
                      style={tailwind`flex-1 bg-gray-800 rounded-full px-4 py-2 text-white mr-2`}
                      placeholder="Add a comment..."
                      placeholderTextColor="#9CA3AF"
                      value={comment}
                      onChangeText={setComment}
                    />
                    <TouchableOpacity
                      style={tailwind`bg-yellow-500 rounded-full p-2`}
                      onPress={handleComment}
                      disabled={isLoading || !comment.trim()}>
                      {isLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Icon name="send" size={20} color="white" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
};

export default React.memo(PostOverlay);
