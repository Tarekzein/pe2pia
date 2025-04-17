import React, { useRef, useState, useCallback, useEffect, memo } from 'react';
import {
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  Dimensions,
  ActivityIndicator,
  Modal as RNModal,
  TouchableWithoutFeedback,
} from 'react-native';
import tailwind from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedScrollHandler,

} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import CommentCardSkeleton from './CommentCardSkeleton';
import CommentForm from './CommentForm';
import CommentCard from './CommentCard';

const { height } = Dimensions.get('window');
const MAX_MODAL_HEIGHT = height * 0.9;
const SWIPE_CLOSE_THRESHOLD = 80;

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);
interface CommentsOverlayProps {
  visible: boolean;
  comments: any[];
  postId: string;
  onClose: () => void;
  isDarkMode: boolean;
  loading: boolean;
  onRefresh?: () => Promise<void>;
  onLoadMore?: () => Promise<void>;
  totalComments?: number;
}

const CommentsOverlay = memo<CommentsOverlayProps>(({ visible, comments, postId, isDarkMode, onClose, loading, onRefresh, onLoadMore, totalComments }) => {
  const flatListRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(height);
  const backdropOpacity = useSharedValue(0);
  const scrollY = useSharedValue(0);

  const animateOpen = useCallback(() => {
    backdropOpacity.value = withTiming(0.5, { duration: 200 });
    translateY.value = withSpring(0, { damping: 25, stiffness: 120 });
  }, []);

  const animateClose = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    translateY.value = withSpring(height, { damping: 25, stiffness: 120 },
      () => runOnJS(onClose)()
    );
  }, [onClose]);

  useEffect(() => {
    if (visible) {animateOpen();}
    else {animateClose();}
  }, [visible]);

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      if (scrollY.value <= 0 && event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd(event => {
      if (event.translationY > SWIPE_CLOSE_THRESHOLD || event.velocityY > 800) {
        animateClose();
      } else {
        translateY.value = withSpring(0, { damping: 25, stiffness: 120 });
      }
    });

  const gestureHandler = Gesture.Simultaneous(panGesture);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    backgroundColor: 'black',
    opacity: backdropOpacity.value,
  }));

  const onListRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const onListEndReached = useCallback(async () => {
    if (!onLoadMore || loadingMore || comments.length >= (totalComments || Infinity)) return;
    setLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setLoadingMore(false);
    }
  }, [onLoadMore, loadingMore, comments.length, totalComments]);

  const renderComment = useCallback(({ item }) => (
    <CommentCard key={item.id || item._id} comment={item} isDarkMode={isDarkMode} />
  ), [isDarkMode]);

  const getItemLayout = useCallback((_, index) => ({ length: 80, offset: 80 * index, index }), []);

  if (!visible) return null;

  return (
    <RNModal visible transparent statusBarTranslucent animationType="none" onRequestClose={animateClose}>
      <TouchableWithoutFeedback onPress={animateClose}>
        <Animated.View style={[tailwind`absolute inset-0`, overlayStyle]} />
      </TouchableWithoutFeedback>
      <GestureDetector gesture={gestureHandler}>
        <Animated.View style={[tailwind`absolute bottom-0 w-full rounded-t-3xl overflow-hidden`, { maxHeight: MAX_MODAL_HEIGHT }, modalStyle]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={insets.bottom}
            style={tailwind`flex-1 bg-${isDarkMode ? 'gray-800' : 'gray-100'}`}
          >
            {loading ? (
              <View style={tailwind`px-4 py-6`}>
                {Array.from({ length: 6 }).map((_, idx) => <CommentCardSkeleton key={idx} isDarkMode={isDarkMode} />)}
              </View>
            ) : (
              <AnimatedFlashList
                ref={flatListRef}
                data={comments}
                estimatedItemSize={80}
                renderItem={renderComment}
                keyExtractor={item => (item.id || item._id).toString()}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                refreshing={refreshing}
                onRefresh={onListRefresh}
                onEndReached={onListEndReached}
                onEndReachedThreshold={0.3}
                ListHeaderComponent={() => (
                  <View style={tailwind`px-4 pt-4`}>
                    <View style={[tailwind`self-center w-12 h-1 rounded-full mb-4`, isDarkMode ? tailwind`bg-gray-600` : tailwind`bg-gray-300`]} />
                    <Text style={tailwind`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Comments ({totalComments || comments.length})</Text>
                  </View>
                )}
                ListFooterComponent={
                  loadingMore ? <ActivityIndicator style={tailwind`py-4`} /> : null
                }
                contentContainerStyle={tailwind`pb-24`}
                getItemLayout={getItemLayout}
                estimatedListSize={{ width: 0, height: comments.length * 80 + 200 }}
              />
            )}
            <View style={tailwind`px-4 py-2 bg-transparent`}>
              <CommentForm
                isDarkMode={isDarkMode}
                postId={postId}
                onSuccess={() => {
                  flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                  onListRefresh();
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </GestureDetector>
    </RNModal>
  );
});

export default CommentsOverlay;
