import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import tailwind from 'twrnc';

const CommentCardSkeleton = ({ isDarkMode }: any) => {
    const shimmer = useSharedValue(0);
    const randomWidth = Math.floor(Math.random() * 7) * 5 + 30;
    // Start the shimmer animation
    React.useEffect(() => {
        shimmer.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    }, [shimmer]);

    // Animated shimmer style
    const shimmerStyle = useAnimatedStyle(() => ({
        opacity: shimmer.value,
    }));

    const shimmerColor = isDarkMode ? '#eeeeee54' : '#D1D5DB';

    return (
        <View style={[tailwind`mb-2  rounded-lg`]}>
            {/* User Info Skeleton */}
            <View style={tailwind`flex-row items-start mb-3`}>
                {/* Profile Picture Skeleton */}
                <Animated.View
                    style={[
                        tailwind`w-12 h-12 rounded-full mr-3`,
                        { backgroundColor: shimmerColor },
                        shimmerStyle,
                    ]}
                />
                <View>
                    {/* Name Skeleton */}
                    <Animated.View
                        style={[
                            tailwind`h-15 w-${randomWidth} rounded-xl mb-1`,
                            { backgroundColor: shimmerColor },
                            shimmerStyle,
                        ]}
                    />
                    {/*/!* Time Skeleton *!/*/}
                    {/*<Animated.View*/}
                    {/*    style={[*/}
                    {/*        tailwind`h-3 w-20 rounded-md`,*/}
                    {/*        { backgroundColor: shimmerColor },*/}
                    {/*        shimmerStyle,*/}
                    {/*    ]}*/}
                    {/*/>*/}
                </View>
            </View>

            {/*/!* Comment Content Skeleton *!/*/}
            {/*<View>*/}
            {/*    {[...Array(3)].map((_, index) => (*/}
            {/*        <Animated.View*/}
            {/*            key={index}*/}
            {/*            style={[*/}
            {/*                tailwind`h-4 rounded-md mb-2`,*/}
            {/*                { width: `${80 - index * 10}%`, backgroundColor: shimmerColor },*/}
            {/*                shimmerStyle,*/}
            {/*            ]}*/}
            {/*        />*/}
            {/*    ))}*/}
            {/*</View>*/}

            {/*/!* Action Buttons Skeleton *!/*/}
            {/*<View style={tailwind`flex-row justify-between items-center mt-3`}>*/}
            {/*    {[...Array(3)].map((_, index) => (*/}
            {/*        <Animated.View*/}
            {/*            key={index}*/}
            {/*            style={[*/}
            {/*                tailwind`w-10 h-4 rounded-md`,*/}
            {/*                { backgroundColor: shimmerColor },*/}
            {/*                shimmerStyle,*/}
            {/*            ]}*/}
            {/*        />*/}
            {/*    ))}*/}
            {/*</View>*/}
        </View>
    );
};

export default CommentCardSkeleton;
