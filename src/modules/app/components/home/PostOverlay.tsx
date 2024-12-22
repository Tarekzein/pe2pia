// PostOverlay.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    PanResponder,
    Animated,
} from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';

interface PostOverlayProps {
    visible: boolean;
    post: any;
    onClose: () => void;
}
const { width, height } = Dimensions.get('window');

const PostOverlay: React.FC<PostOverlayProps> = ({ visible, post, onClose }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const translateY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (visible) {
            translateY.setValue(0);
            opacity.setValue(1);
        }
    }, [visible]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 10;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) { // Only allow downward movement
                    translateY.setValue(gestureState.dy);
                    // Calculate opacity based on movement
                    const newOpacity = 1 - (gestureState.dy / (height * 0.5));
                    opacity.setValue(Math.max(0, newOpacity));
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100 || gestureState.vy > 0.5) {
                    // Close modal if dragged down enough or with enough velocity
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
                            tension: 100,
                            friction: 8,
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

    const handleSwipe = (event: any) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(scrollX / width);
        setActiveIndex(newIndex);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <Animated.View
                style={[
                    tailwind`flex-1 justify-evenly bg-black`,
                    {
                        opacity: opacity,
                        transform: [{ translateY }],
                    }
                ]}
                {...panResponder.panHandlers}>
                {/* Close Button */}
                <TouchableOpacity
                    style={tailwind`absolute top-5 right-5 z-10`}
                    onPress={onClose}>
                    <Icon name="x" size={30} color="white" />
                </TouchableOpacity>

                {/* Post Details */}
                <View style={tailwind`p-4`}>
                    <Text style={tailwind`text-white text-lg font-bold mb-2`}>
                        {post.user.FirstName} {post.user.LastName}
                    </Text>
                    <Text style={tailwind`text-gray-300 text-sm mb-4`}>
                        {post.description}
                    </Text>
                </View>

                <View>
                    {/* Image Gallery */}
                    <FlatList
                        data={post.files}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => `image-${index}`}
                        onScroll={handleSwipe}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item.url }}
                                style={{ width, height: 300, resizeMode: 'cover' }}
                            />
                        )}
                    />

                    {/* Image Indicators */}
                    <View style={tailwind`flex-row justify-center mt-2`}>
                        {post.files.map((_: any, index: React.Key | null | undefined) => (
                            <View
                                key={index}
                                style={[
                                    tailwind`w-2 h-2 rounded-full mx-1`,
                                    {
                                        backgroundColor:
                                            index === activeIndex ? '#FEA928' : '#A1A1AA',
                                    },
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Comments and Likes */}
                <View style={tailwind`flex-row justify-around mt-4`}>
                    <TouchableOpacity style={tailwind`flex-col items-center`}>
                        <Icon name="heart" size={24} color="#FEA928" />
                        <Text style={tailwind`text-white text-sm`}>{post.likes.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tailwind`flex-col items-center`}>
                        <Icon name="message-circle" size={24} color="#FEA928" />
                        <Text style={tailwind`text-white text-sm`}>
                            {post.comments?.length || 0}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </Modal>
    );
};

export default PostOverlay;
