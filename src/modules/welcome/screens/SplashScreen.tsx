import React, { useEffect } from 'react';
import { Text, Image, ImageBackground } from 'react-native';
import tailwind from 'twrnc';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen:React.FC<SplashScreenProps> = ({ navigation })=> {
  const logoOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 1000, easing: Easing.ease }, () => {
      subtitleOpacity.value = withTiming(1, { duration: 1000, easing: Easing.ease }, () => {
        screenOpacity.value = withTiming(0, { duration: 800, easing: Easing.ease }, () => {
          runOnJS(navigation.replace)('Welcome1Screen'); // Use replace to avoid stacking screens
        });
      });
    });
  }, [logoOpacity, subtitleOpacity, screenOpacity, navigation]);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  const animatedSubtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const animatedScreenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <ImageBackground
      source={require('../assets/2.png')}
      style={[tailwind`flex-1 justify-center items-center`, { backgroundColor: '#FEA928' }]}
      resizeMode="cover"
    >
      <Animated.View style={[tailwind`absolute inset-0 justify-center items-center`, animatedScreenStyle]}>
        <Animated.View style={[tailwind`flex flex-row items-center`, animatedLogoStyle]}>
          <Text style={tailwind`text-[5rem] font-bold text-[#00347D]`}>Pe</Text>
          <Image source={require('../assets/3.png')} style={tailwind`w-13`} />
          <Text style={tailwind`text-[5rem] font-bold text-[#00347D]`}>pia</Text>
        </Animated.View>
        <Animated.Text style={[tailwind`text-lg text-white mt-2`, animatedSubtitleStyle]}>
          Make more memories
        </Animated.Text>
      </Animated.View>
    </ImageBackground>
  );
}

export default SplashScreen;
