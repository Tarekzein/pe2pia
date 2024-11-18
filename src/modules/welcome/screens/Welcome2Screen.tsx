import React, { useEffect } from 'react';
import { Text, Image, View } from 'react-native';
import tailwind from 'twrnc';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Button from '../components/Button';


interface Welcome2ScreenProps {
  navigation: any;
}
const Welcome2Screen: React.FC <Welcome2ScreenProps> = ({ navigation }) =>{
  // Shared values for animations
  const pattern1Position = useSharedValue(-100);
  const pattern2Position = useSharedValue(100);
  const websiteOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate patterns
    pattern1Position.value = withTiming(0, { duration: 500, easing: Easing.ease });
    pattern2Position.value = withTiming(0, { duration: 500, easing: Easing.ease });

    // Animate website image after patterns
    setTimeout(() => {
      websiteOpacity.value = withTiming(1, { duration: 1000, easing: Easing.ease });

      // Animate text after website image
      setTimeout(() => {
        textOpacity.value = withTiming(1, { duration: 1000, easing: Easing.ease });

        // Animate buttons after text
        setTimeout(() => {
          buttonOpacity.value = withTiming(1, { duration: 1000, easing: Easing.ease });
        }, 500);
      }, 500);
    }, 500);
  }, [pattern1Position, pattern2Position, websiteOpacity, textOpacity, buttonOpacity]);

  // Animated styles
  const pattern1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: pattern1Position.value }],
  }));

  const pattern2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: pattern2Position.value }],
  }));

  const websiteStyle = useAnimatedStyle(() => ({
    opacity: websiteOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <View
      style={[
        tailwind`flex-1 justify-evenly relative px-10 pt-15 items-center bg-[#FEA928]`,
      ]}
    >
      {/* Pattern 1 animation */}
      <Animated.Image
        source={require('../assets/pattern1.png')}
        style={[
          tailwind`w-fit absolute top-0 left-0`,
          pattern1Style,
        ]}
      />

      {/* Pattern 2 animation */}
      <Animated.Image
        source={require('../assets/pattern2.png')}
        style={[
          tailwind`w-fit absolute bottom-0 right-0`,
          pattern2Style,
        ]}
      />

      {/* Website image animation */}
      <Animated.Image
        source={require('../assets/website.png')}
        style={[
          tailwind`w-fit mt-10`,
          websiteStyle,
        ]}
      />

      {/* Text animation */}
      <Animated.View style={[textStyle, tailwind`mt-5`]}>
        <Text style={tailwind`text-3xl font-bold text-center text-[#00347D]`}>
          Discover your pets’ world like never before
        </Text>
        <Text style={tailwind`text-xl mt-3 text-white text-center`}>
          Discover all the news, learn more about your pet, and find everything
          you need!
        </Text>
      </Animated.View>

      {/* Buttons animation */}
      <Animated.View style={[buttonStyle, tailwind`w-full mt-10`]}>
        <Button
          mode={'contained'}
          style={tailwind`bg-[#eee] mt-4`}
          onPress={() => navigation.navigate('OnboardingScreen')}
        >
          <Text style={tailwind`text-xl text-[#FEA928]`}>Skip</Text>
        </Button>

        <Button
          mode={'contained'}
          style={tailwind`bg-[#00347D] mt-4`}
          onPress={() => navigation.navigate('Welcome3Screen')}
        >
          <Text style={tailwind`text-xl text-[#FEA928]`}>Continue</Text>
        </Button>
      </Animated.View>
    </View>
  );
}

export default Welcome2Screen;
