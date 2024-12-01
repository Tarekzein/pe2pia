import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../../../core/theme';
import { passwordValidator } from '../helpers/passwordValidator';
import { useAuth } from '../../../context/AuthContext';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import tailwind from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ResetPasswordScreen({ navigation }) {
    const [password, setPassword] = useState({ value: '', error: '' });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });
    const { resetPassword,forgotPasswordEmail,error } = useAuth();
    const pattern1Position = useSharedValue(100);
    const pattern2Position = useSharedValue(-100);
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

    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
    }));


    const onResetPasswordPressed = () => {
    const passwordError = passwordValidator(password.value);
    const confirmPasswordError = password.value !== confirmPassword.value ? "Passwords do not match" : '';

    if (passwordError || confirmPasswordError) {
      setPassword({ ...password, error: passwordError });
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
      return;
    }

    resetPassword(forgotPasswordEmail, password.value, confirmPassword.value);
    if (error) {
      setPassword({ ...password, error: error });
      setConfirmPassword({ ...confirmPassword, error: error });
      return;
    }
    navigation.navigate('LoginScreen');
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
                  Reset Password.
              </Text>
              <Animated.View style={[tailwind`flex flex-row items-center`]}>
                  <Text style={tailwind`text-xl font-bold text-[#00347D]`}>
                      Please reset your password to login to the application.
                  </Text>
              </Animated.View>
          </Animated.View>
      <View style={tailwind`w-full mt-5`}>

          {/* Password Input */}
          <View style={tailwind`relative `}>
              <View style={tailwind`absolute z-2 inset-y-0 left-5 top-9 flex items-center`}>
                  <Icon name="lock" size={20} color="#888" />
              </View>
              <TextInput
                  placeholder="Password"
                  style={tailwind`bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-1.5`}
                  outlineStyle={tailwind`border rounded-xl `}
                  value={password.value}
                  onChangeText={(text) => setPassword({ value: text, error: '' })}
                  secureTextEntry={!passwordVisible}
                  errorText={password.error}
              />
              <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={tailwind`absolute z-2 inset-y-0 right-5 top-9 flex items-center`}
              >
                  <Icon
                      name={passwordVisible ? 'eye' : 'eye-off'}
                      size={20}
                      color="#888"
                  />
              </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={tailwind`relative `}>
              <View style={tailwind`absolute z-2 inset-y-0 left-5 top-9 flex items-center`}>
                  <Icon name="lock" size={20} color="#888" />
              </View>
              <TextInput
                  placeholder="Confirm Password"
                  style={tailwind`bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-1.5`}
                  outlineStyle={tailwind`border rounded-xl `}            value={confirmPassword.value}
                  onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
                  secureTextEntry
                  errorText={confirmPassword.error}
              />
          </View>
      </View>
      <Button
        mode="contained"
        style={tailwind`bg-[#00347D] text-[#FEA928] text-xl mt-4`}
        onPress={onResetPasswordPressed}
      >
        Reset Password
      </Button>
      <View style={styles.row}>
        <Text style={tailwind`text-white font-bold`}>Remembered your password? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={tailwind`font-bold text-[#00347D]`}>Login</Text>
        </TouchableOpacity>
      </View>
      </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  }
});
