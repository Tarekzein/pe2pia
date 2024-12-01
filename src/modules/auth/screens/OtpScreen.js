// src/screens/OtpScreen.js

import React, { useState, useRef, useEffect } from 'react';
import {View, TextInput, Text, TouchableOpacity, Image} from 'react-native';
import tailwind from 'twrnc';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import Button from '../components/Button';
import { useAuth } from '../../../context/AuthContext';
import { otpValidator } from '../helpers/otpValidator';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function OtpScreen({ navigation }) {
  const [otp, setOtp] = useState({ value: new Array(6).fill(''), error: '' });
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputs = useRef([]);
  const { forgotPasswordEmail, forgotPassword, verifyOtp,error } = useAuth();
  const pattern1Position = useSharedValue(100);
  const pattern2Position = useSharedValue(-100);
  const websiteOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Countdown timer for resend button
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);
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

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const handleResendOtp = () => {
    forgotPassword(forgotPasswordEmail);
    setTimer(30); // Reset timer
    setIsResendDisabled(true); // Disable button until timer completes
  };

  const handleChange = (text, index) => {
    const newOtp = [...otp.value];

    // If text is empty and index > 0, move focus back
    if (text === '' && index > 0) {
      inputs.current[index - 1].focus();
    } else if (text && index < 5) {
      // Move focus to next input if input is filled
      inputs.current[index + 1].focus();
    }

    // Update OTP value
    newOtp[index] = text;
    setOtp({ ...otp, value: newOtp });
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace explicitly
    if (e.nativeEvent.key === 'Backspace' && !otp.value[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };


  const handleConfirmOtp = () => {
    const otpCode = otp.value.join('');
    const otpError = otpValidator(otpCode);
    if (otpError) {
      setOtp({ ...otp, error: otpError });
      return;
    }
    verifyOtp(forgotPasswordEmail, otpCode);
    if (error) {
      setOtp({ ...otp, error: error });
      return;
    }
    navigation.navigate('ResetPasswordScreen');
    // Add OTP confirmation logic, like an API call, here
  };

  return (
      <View
          style={[
            tailwind`flex-1 justify-center relative px-10  items-center bg-[#FEA928]`,
          ]}
      >

        {/* Header */}
        <View style={tailwind`absolute top-0 left-0 mt-5 ml-5`}>
          <Icon name={'arrow-left'} size={30} color={'#00347D'} onPress={() => navigation.goBack()} />
        </View>

        {/* Pattern 1 animation */}
        <Animated.View
            style={[
              tailwind`absolute top-0 right-0`, // Positioning for Pattern 1
              pattern1Style, // Animation
            ]}
        >
          <Image source={require('../../welcome/assets/pattern1.png')} style={[tailwind`w-fit`,
            { transform: [{ scaleX: -1 }] }, // Flip horizontally
          ]} />
        </Animated.View>

        {/* Pattern 2 animation */}
        <Animated.View
            style={[
              tailwind`absolute bottom-0 left-0`, // Positioning for Pattern 2
              pattern2Style, // Animation
            ]}
        >
          <Image source={require('../../welcome/assets/pattern2.png')} style={[tailwind`w-fit`,
            { transform: [{ scaleX: -1 }] }, // Flip horizontally
          ]} />
        </Animated.View>
        {/* Text animation */}
        <Animated.View style={[textStyle, tailwind`mt-5 w-full items-start`]}>

          {/* Subtitle */}
          <Text style={tailwind`text-4xl font-bold mt-3 text-white text-left`}>
            Confirm OTP.
          </Text>
          <Animated.View style={[tailwind`flex flex-row items-center`]}>
            <Text style={tailwind`text-xl font-bold text-[#00347D]`}>
              Please enter the 6-digit code sent to your email.
            </Text>
          </Animated.View>
        </Animated.View>



      <View style={tailwind`flex-row justify-evenly my-5 space-x-2 rtl:space-x-reverse`}>
        {otp.value.map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={tailwind`w-12 h-12 mx-1 text-center text-xl font-extrabold bg-white border border-gray-300 rounded-lg`}
            maxLength={1}
            keyboardType="numeric"
            value={otp.value[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>
      {/* Error message */}
      {otp.error ? (
        <Text style={tailwind`text-red-500 text-center mb-2`}>
          {otp.error}
        </Text>
      ) : null}
      <Button
        mode="contained"
        onPress={handleConfirmOtp}
        style={tailwind`bg-[#00347D] text-[#FEA928] text-xl mt-4`}
      >
        Confirm OTP
      </Button>

      <TouchableOpacity
        onPress={handleResendOtp}
        disabled={isResendDisabled}
        style={tailwind`mt-4`}
      >
        <Text
          style={tailwind`text-center font-bold text-lg ${
            isResendDisabled ? 'text-white' : 'text-gray-200'
          }`}
        >
          {isResendDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
      </View>
  );
}
