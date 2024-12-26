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

const CommentsOverlay: React.FC<CommentsOverlayProps> = ({
                                                             visible,
                                                             comments,
                                                             postId,
                                                             isDarkMode,
                                                             onClose,
                                                             loading,
                                                         }) => {
    const translateY = useRef(new Animated.Value(height)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const isAtTop = useRef(true); // Track if FlatList is scrolled to the top

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => isAtTop.current,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 10 && isAtTop.current;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) { // Only allow downward movement
                    translateY.setValue(gestureState.dy);
                    const newOpacity = 1 - gestureState.dy / (height * 0.5);
                    opacity.setValue(Math.max(0, newOpacity));
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100 || gestureState.vy > 0.5) {
                    // Close modal if dragged down enough
                    Animated.parallel([
                        Animated.timing(translateY, {
                            toValue: height,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacity, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                    ]).start(onClose);
                } else {
                    // Snap back to original position
                    Animated.parallel([
                        Animated.spring(translateY, {
                            toValue: 0,
                            useNativeDriver: true,
                        }),
                        Animated.spring(opacity, {
                            toValue: 1,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }
            },
        })
    ).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Animated.View
                style={[
                    tailwind`flex-1 justify-end`,
                    { transform: [{ translateY }] },
                ]}
                {...panResponder.panHandlers}
            >
                <KeyboardAvoidingView
                    style={tailwind`${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    } flex-1 justify-between rounded-t-3xl p-4`}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <TouchableOpacity
                        style={tailwind`absolute top-5 right-5 z-10`}
                        onPress={() => {
                            Animated.timing(translateY, {
                                toValue: height,
                                duration: 200,
                                useNativeDriver: true,
                            }).start(onClose);
                        }}
                    >
                        <Icon
                            name="x"
                            size={30}
                            style={tailwind`${isDarkMode ? 'text-white' : 'text-gray-600'}`}
                        />
                    </TouchableOpacity>

                    <Text
                        style={tailwind`text-lg font-bold mb-4 ${
                            isDarkMode ? 'text-white' : 'text-gray-600'
                        }`}
                    >
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
                            ref={flatListRef}
                            data={comments}
                            keyExtractor={(_, index) => `comment-${index}`}
                            renderItem={({ item }) => (
                                <CommentCard comment={item} isDarkMode={isDarkMode} />
                            )}
                            onScroll={(e) => {
                                // Check if FlatList is scrolled to the top
                                isAtTop.current =
                                    e.nativeEvent.contentOffset.y <= 0;
                            }}
                            scrollEventThrottle={16} // Ensure smooth scrolling
                            contentContainerStyle={tailwind`pb-20`}
                            showsVerticalScrollIndicator={false}
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