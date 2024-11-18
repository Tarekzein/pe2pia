import React, { useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Button from '../components/Button';


interface OnboardingScreenProps {
  navigation: any;
}
const OnboardingScreen: React.FC <OnboardingScreenProps> = ({ navigation }) =>{
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
        tailwind`flex-1 justify-evenly relative px-10 pt-30 items-center bg-[#00347D]`,
      ]}
    >
      {/* Header */}
      <View style={tailwind`absolute top-0 left-0 mt-5 ml-5`}>
        <Icon name={'arrow-left'} size={30} color={'#FEA928'} onPress={() => navigation.goBack()} />
      </View>
      {/* Pattern 1 animation */}
      <Animated.View
        style={[
          tailwind`absolute top-0 left-0`, // Positioning for Pattern 1
          pattern1Style, // Animation
        ]}
      >
        <Image source={require('../assets/pattern3.png')} style={[tailwind`w-fit`,
        ]} />
      </Animated.View>

      {/* Pattern 2 animation */}
      <Animated.View
        style={[
          tailwind`absolute bottom-0 right-0`, // Positioning for Pattern 2
          pattern2Style, // Animation
        ]}
      >
        <Image source={require('../assets/pattern4.png')} style={[tailwind`w-fit`,
        ]} />
      </Animated.View>

      {/* Text animation */}
      <Animated.View style={[textStyle, tailwind`mt-5 w-full items-start`]}>
        {/* "Pe" + Image + "pia" Row */}
        <Animated.View style={[tailwind`flex flex-row items-center`]}>
          <Text style={tailwind`text-[2rem] font-bold text-[#FEA928]`}>Pe</Text>
          <Image
            source={require('../assets/3.png')}
            style={tailwind`w-8 h-8 `} // Smaller, responsive image
            resizeMode="contain" // Ensures the image scales correctly
          />
          <Text style={tailwind`text-[2rem] font-bold text-[#FEA928]`}>pia</Text>
        </Animated.View>
        {/* Subtitle */}
        <Text style={tailwind`text-4xl font-bold mt-3 text-white text-left`}>
          Welcomes You
        </Text>
      </Animated.View>


      {/* Website image animation */}
      <Animated.Image
        source={require('../assets/sitting-8.png')}
        style={[
          tailwind`w-fit mt-10`,
          websiteStyle,
        ]}
      />

      {/* Buttons animation */}
      <Animated.View style={[buttonStyle, tailwind`w-full mt-10`]}>
        <Button
          mode={'contained'}
          style={tailwind`bg-[#FEA928] mt-4`}
          onPress={() => navigation.navigate('AuthNavigator', { screen: 'RegisterScreen' })} // Navigate to AuthNavigator and then RegisterScreen
        >
          <Text style={tailwind`text-xl text-[#00347D]`}>Sign Up</Text>
        </Button>

        <Button
          mode={'contained'}
          style={tailwind`bg-[#eee] mt-4`}
          onPress={() => navigation.navigate('AuthNavigator', { screen: 'LoginScreen' })} // Navigate to AuthNavigator and then LoginScreen
        >
          <Text style={tailwind`text-xl text-[#FEA928]`}>Already have an account</Text>
        </Button>
      </Animated.View>

    </View>
  );
}

export default OnboardingScreen;
