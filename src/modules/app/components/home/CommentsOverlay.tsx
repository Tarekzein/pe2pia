import React, { useRef, useState } from 'react';
import {
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import tailwind from 'twrnc';
import Modal from 'react-native-modal';
import CommentCardSkeleton from './CommentCardSkeleton.tsx';
import CommentForm from './CommentForm.tsx';
import CommentCard from './CommentCard.tsx';

interface CommentsOverlayProps {
  visible: boolean;
  comments: any;
  postId: string;
  onClose: () => void;
  isDarkMode: boolean;
  loading: boolean;
}

const CommentsOverlay: React.FC<CommentsOverlayProps> = ({
                                                           visible,
                                                           comments,
                                                           postId,
                                                           isDarkMode,
                                                           onClose,
                                                           loading,
                                                         }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  // Define a threshold below which swipe-to-close is enabled.
  const SWIPE_THRESHOLD = 20;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const position = event.nativeEvent.contentOffset.y;
    // Debug log if needed:
    // console.log('Scroll position:', position);
    setScrollPosition(position);
  };

  return (
    <Modal
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionOutTiming={0}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      isVisible={visible}
      style={tailwind`justify-end m-0`}
      // Enable swipe-to-close only when the content is near the top.
      swipeDirection={scrollPosition < SWIPE_THRESHOLD ? ['down'] : []}
      propagateSwipe={true}
      avoidKeyboard={true}
    >
      <KeyboardAvoidingView
        style={[
          tailwind`flex-1 justify-between rounded-t-3xl p-4`,
          isDarkMode ? tailwind`bg-gray-700` : tailwind`bg-gray-100`,
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Drag Handle */}
        <View
          style={[
            tailwind`self-center w-12 h-1 rounded-full mb-6`,
            isDarkMode ? tailwind`bg-gray-600` : tailwind`bg-gray-300`,
          ]}
        />

        <Text
          style={tailwind`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}
        >
          Comments
        </Text>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={tailwind`pb-20`}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
        >
          {loading ? (
            <>
              {[...Array(8)].map((_, index) => (
                <CommentCardSkeleton key={index} isDarkMode={isDarkMode} />
              ))}
            </>
          ) : comments && comments.length > 0 ? (
            <>
              {comments.map((comment: any, index: number) => (
                <CommentCard
                  key={`comment-${index}`}
                  comment={comment}
                  isDarkMode={isDarkMode}
                />
              ))}
            </>
          ) : (
            <Text style={tailwind`text-center text-gray-500 mt-5`}>
              No comments available.
            </Text>
          )}
        </ScrollView>

        <CommentForm isDarkMode={isDarkMode} postId={postId} />
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommentsOverlay;
