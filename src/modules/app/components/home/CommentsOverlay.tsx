import React, { useRef, useEffect } from 'react';
import {
    Modal,
    Text,
    TouchableOpacity,
    FlatList,
    Dimensions,
    PanResponder,
    Animated,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import CommentCardSkeleton from './CommentCardSkeleton.tsx';
import CommentForm from './CommentForm.tsx';
import CommentCard from "./CommentCard.tsx";

interface CommentsOverlayProps {
    visible: boolean;
    comments: any;
    postId: string;
    onClose: () => void;
    isDarkMode: boolean;
    loading: boolean;
}
const { height } = Dimensions.get('window');

const CommentsOverlay: React.FC<CommentsOverlayProps> = ({ visible, comments,postId, isDarkMode, onClose,loading }) => {
    const translateY = useRef(new Animated.Value(height)).current;
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 20;
            },
            onPanResponderMove: Animated.event(
                [null, { dy: translateY }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > height * 0.3) {
                    Animated.timing(translateY, {
                        toValue: height,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(onClose);
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: height,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [translateY, visible]);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <Animated.View
          style={[
            tailwind`flex-1 justify-end bg-black bg-opacity-90`,
            {transform: [{translateY}]},
          ]}
          {...panResponder.panHandlers}>
          <KeyboardAvoidingView
            style={tailwind`${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            } flex-1 justify-between rounded-t-3xl p-4`}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* Close Button */}
            <TouchableOpacity
              style={tailwind`absolute top-5 right-5 z-10`}
              onPress={() => {
                Animated.timing(translateY, {
                  toValue: height,
                  duration: 200,
                  useNativeDriver: true,
                }).start(onClose);
              }}>
              <Icon
                name="x"
                size={30}
                style={tailwind`${isDarkMode ? 'text-white' : 'text-gray-600'}`}
              />
            </TouchableOpacity>

            <Text
              style={tailwind`text-lg font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-600'
              }`}>
              Comments
            </Text>
            {loading ? (
              <ScrollView>
                {[...Array(8)].map((_, index) => (
                  <CommentCardSkeleton key={index} isDarkMode={isDarkMode} />
                ))}
              </ScrollView>
            ) : comments && comments.length > 0 ? (
              <FlatList
                data={comments}
                keyExtractor={(_, index) => `comment-${index}`}
                renderItem={({item}) =>
                    <CommentCard comment={item} isDarkMode={isDarkMode} />
              }
                contentContainerStyle={tailwind`pb-20`}
                keyboardShouldPersistTaps="handled"
              />
            ) : (
              <Text style={tailwind`text-center text-gray-500 mt-5`}>
                No comments available.
              </Text>
            )}
            <CommentForm isDarkMode={isDarkMode} postId={postId} />
          </KeyboardAvoidingView>
        </Animated.View>
      </Modal>
    );
};

export default CommentsOverlay;
