import React, { useEffect } from 'react';
import { Text, Image, ImageBackground } from 'react-native';
import tailwind from 'twrnc';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Button from '../components/Button';

interface Welcome1ScreenProps {
  navigation: any;
}

const Welcome1Screen: React.FC <Welcome1ScreenProps> = ({ navigation }) =>{
  const logoOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 1000, easing: Easing.ease }, () => {
      subtitleOpacity.value = withTiming(1, { duration: 1000, easing: Easing.ease });
    });
  }, [logoOpacity, subtitleOpacity]);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  const animatedSubtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <ImageBackground
      source={require('../assets/welcome1.png')}
      style={[tailwind`flex-1 justify-center items-center`]}
      resizeMode="cover"
    >
      <Animated.View style={[tailwind`absolute inset-0 justify-center mx-10 mt-100`]}>
        <Animated.View style={[tailwind`flex flex-row items-center`, animatedLogoStyle]}>
          <Text style={tailwind`text-4xl font-bold text-[#FEA928]`}>Welcome to</Text>
        </Animated.View>
        <Animated.View style={[tailwind`flex flex-row items-center`, animatedLogoStyle]}>
          <Text style={tailwind`text-[5rem] font-bold text-[#FEA928]`}>Pe</Text>
          <Image source={require('../assets/3.png')} style={tailwind`w-13`} />
          <Text style={tailwind`text-[5rem] font-bold text-[#FEA928]`}>pia</Text>
        </Animated.View>
        <Animated.Text style={[tailwind`text-lg text-white my-2`, animatedSubtitleStyle]}>
          We make sharing your pet's moments easy with Pe2pia, where you can connect with fellow pet lovers and get expert advice, all at your fingertips.
        </Animated.Text>
        <Button
          style={tailwind`bg-[#FEA928] mt-4`}
          onPress={() => navigation.navigate('Welcome2Screen')}
          mode={'contained'}
        >
          <Text style={tailwind`text-xl text-[#00347D]`}>Get Started</Text>
        </Button>
      </Animated.View>
    </ImageBackground>
  );
}

export default Welcome1Screen;
