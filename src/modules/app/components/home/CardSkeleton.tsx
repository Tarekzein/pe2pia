import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import tailwind from 'twrnc'; // Ensure you have tailwind-rn or equivalent installed

const CardSkeleton = ({ isDarkMode }: any) => {
    const shimmer = useSharedValue(0);

    // Start the shimmer animation
    React.useEffect(() => {
        shimmer.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    }, [shimmer]);

    // Animated shimmer style
    const shimmerStyle = useAnimatedStyle(() => ({
        opacity: shimmer.value,
    }));

    const backgroundColor = isDarkMode ? tailwind`bg-gray-800`.backgroundColor : '#FFF8EC';
    const shimmerColor = isDarkMode ? '#eeeeee54' : '#D1D5DB';

    return (
        <View style={[tailwind`mb-2 rounded-xl p-4`, { backgroundColor }]}>
            {/* User Info Skeleton */}
            <View style={tailwind`flex-row justify-between items-center`}>
                <View style={tailwind`flex-row`}>
                    {/* Profile Picture Skeleton */}
                    <Animated.View
                        style={[
                            tailwind`w-10 h-10 mr-2 rounded-full`,
                            { backgroundColor: shimmerColor },
                            shimmerStyle,
                        ]}
                    />
                    <View>
                        {/* Name Skeleton */}
                        <Animated.View
                            style={[
                                tailwind`h-4 w-24 rounded-md mb-1`,
                                { backgroundColor: shimmerColor },
                                shimmerStyle,
                            ]}
                        />
                        {/* Category Skeleton */}
                        <Animated.View
                            style={[
                                tailwind`h-3 w-16 rounded-md`,
                                { backgroundColor: shimmerColor },
                                shimmerStyle,
                            ]}
                        />
                    </View>
                </View>
                <TouchableOpacity>
                    {/* Options Icon Skeleton */}
                    <Animated.View
                        style={[
                            tailwind`w-6 h-6 rounded-md`,
                            { backgroundColor: shimmerColor },
                            shimmerStyle,
                        ]}
                    />
                </TouchableOpacity>
            </View>

            {/* Content Skeleton */}
            <Animated.View
                style={[
                    tailwind`mt-4 rounded-lg h-20 justify-center`,
                    isDarkMode ? tailwind`bg-gray-600` : tailwind`bg-gray-300`,
                    shimmerStyle,
                ]}
            />

            {/* Action Buttons Skeleton */}
            <View
                style={[
                    tailwind`flex-row justify-between items-center mt-4 pt-4`,
                    { borderTopWidth: 1, borderColor: shimmerColor },
                ]}
            >
                {[...Array(3)].map((_, index) => (
                    <TouchableOpacity key={index} style={tailwind`flex-col justify-center items-center`}>
                        {/* Icon Skeleton */}
                        <Animated.View
                            style={[
                                tailwind`w-6 h-6 rounded-md mb-1`,
                                { backgroundColor: shimmerColor },
                                shimmerStyle,
                            ]}
                        />
                        {/* Text Skeleton */}
                        <Animated.View
                            style={[
                                tailwind`h-3 w-8 rounded-md`,
                                { backgroundColor: shimmerColor },
                                shimmerStyle,
                            ]}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default CardSkeleton;
