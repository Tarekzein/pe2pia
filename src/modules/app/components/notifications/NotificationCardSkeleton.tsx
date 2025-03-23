import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import tailwind from 'twrnc';

interface NotificationCardSkeletonProps {
  isDarkMode?: boolean;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const NotificationCardSkeleton: React.FC<NotificationCardSkeletonProps> = ({ isDarkMode }) => {
  // Use different placeholder colors for dark/light mode
  const placeholderBg = isDarkMode ? '#4b5563' : '#e5e7eb';
  const borderColor = isDarkMode ? '#37415150' : '#cbd5e150';

  // Animated value for shimmer effect
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Loop the animation indefinitely
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  // Interpolate translateX value for shimmer movement.
  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200], // Adjust these values based on your component's width
  });

  return (
    <View style={{ position: 'relative' }}>
      <LinearGradient
        colors={
          isDarkMode
            ? ['rgba(55, 65, 81, 0.5)', 'rgba(55, 65, 81, 0.3)']
            : ['rgba(254, 203, 125, 0.16)', 'rgba(254, 203, 125, 0.08)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          tailwind`mx-4 my-2 rounded-xl overflow-hidden`,
          {
            shadowColor: isDarkMode ? '#ffffff20' : '#00000020',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          },
        ]}
      >
        <View
          style={[
            tailwind`flex-row items-center p-4`,
            isDarkMode ? tailwind`bg-gray-800/50` : tailwind`bg-transparent`,
          ]}
        >
          {/* Avatar Skeleton */}
          <View style={tailwind`relative mr-4`}>
            <View
              style={[
                tailwind`w-14 h-14 rounded-full`,
                {
                  backgroundColor: placeholderBg,
                  borderWidth: 2,
                  borderColor: borderColor,
                },
              ]}
            />
            {/* Notification Type Icon Skeleton */}
            <View
              style={[
                tailwind`absolute -bottom-1 -right-1 p-1 rounded-full`,
                {
                  backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                  borderWidth: 2,
                  borderColor: isDarkMode ? '#374151' : '#f3f4f6',
                },
              ]}
            />
          </View>

          {/* Text Content Skeleton */}
          <View style={tailwind`flex-1`}>
            {/* Title Skeleton */}
            <View
              style={[
                tailwind`h-4 rounded mb-2`,
                { backgroundColor: placeholderBg, width: '70%' },
              ]}
            />
            {/* Message Skeleton */}
            <View
              style={[
                tailwind`h-3 rounded mb-1`,
                { backgroundColor: placeholderBg, width: '90%' },
              ]}
            />
            <View
              style={[
                tailwind`h-3 rounded mb-1`,
                { backgroundColor: placeholderBg, width: '80%' },
              ]}
            />
            {/* Date Skeleton */}
            <View
              style={[
                tailwind`h-2 rounded mt-2 self-end`,
                { backgroundColor: placeholderBg, width: '40%' },
              ]}
            />
          </View>
          {/* Shimmer Overlay */}
          <AnimatedLinearGradient
            colors={
              isDarkMode
                ? ['transparent', 'rgba(255,255,255,0.2)', 'transparent']
                : ['transparent', 'rgba(0,0,0,0.1)', 'transparent']
            }
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transform: [{ translateX }],
            }}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </View>
      </LinearGradient>


    </View>
  );
};

export default NotificationCardSkeleton;
