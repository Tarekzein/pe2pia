// src/screens/OtpScreen.js

import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import { useAuth } from '../../../hooks/AuthProvider';
import { otpValidator } from '../helpers/otpValidator';

export default function OtpScreen({ navigation }) {
  const [otp, setOtp] = useState({ value: new Array(6).fill(''), error: '' });
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputs = useRef([]);
  const { forgotPasswordEmail, forgotPassword, verifyOtp,error } = useAuth();

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

  const handleResendOtp = () => {
    forgotPassword(forgotPasswordEmail);
    setTimer(30); // Reset timer
    setIsResendDisabled(true); // Disable button until timer completes
  };

  const handleChange = (text, index) => {
    // Set OTP digit
    const newOtp = [...otp.value];
    newOtp[index] = text;
    setOtp({ ...otp, value: newOtp });

    // Automatically move to next input field if a digit is entered
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
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
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Confirm OTP</Header>

      <Text style={tailwind`text-sm text-gray-500 text-center mt-4`}>
        Please enter the 6-digit code sent to your email.
      </Text>



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
        style={tailwind`mt-5`}
      >
        Confirm OTP
      </Button>

      <TouchableOpacity
        onPress={handleResendOtp}
        disabled={isResendDisabled}
        style={tailwind`mt-4`}
      >
        <Text
          style={tailwind`text-center text-lg ${
            isResendDisabled ? 'text-gray-400' : 'text-blue-500'
          }`}
        >
          {isResendDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    </Background>
  );
}
