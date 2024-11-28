import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { emailValidator } from '../helpers/emailValidator';
import { passwordValidator } from '../helpers/passwordValidator';
import { nameValidator } from '../helpers/nameValidator';
import { useAuth } from '../../../context/AuthContext';
import tailwind from 'twrnc';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { register } = useAuth(register);

  const pattern1Position = useSharedValue(100);
  const pattern2Position = useSharedValue(-100);
  const textOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate patterns
    pattern1Position.value = withTiming(0, { duration: 500, easing: Easing.ease });
    pattern2Position.value = withTiming(0, { duration: 500, easing: Easing.ease });

    // Animate text and buttons
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 1000, easing: Easing.ease });
      setTimeout(() => {
        buttonOpacity.value = withTiming(1, { duration: 1000, easing: Easing.ease });
      }, 500);
    }, 500);
  }, [pattern1Position, pattern2Position, textOpacity, buttonOpacity]);

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

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    width: '100%',
  }));

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const confirmPasswordError =
      password.value !== confirmPassword.value ? 'Passwords do not match' : '';

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
      return;
    }
    // register(email.value, name.value, password.value);
  };

  return (
    <View
      style={tailwind`flex-1 justify-evenly relative px-10 pt-10 items-center bg-[#FEA928]`}
    >
      {/* Back Button */}
      <View style={tailwind`absolute top-0 left-0 mt-5 ml-5`}>
        <Icon
          name={'arrow-left'}
          size={30}
          color={'#00347D'}
          onPress={() => navigation.goBack()}
        />
      </View>

      {/* Pattern 1 */}
      <Animated.View style={[tailwind`absolute top-0 right-0`, pattern1Style]}>
        <Image
          source={require('../../welcome/assets/pattern1.png')}
          style={[tailwind`w-fit`, { transform: [{ scaleX: -1 }] }]}
        />
      </Animated.View>

      {/* Pattern 2 */}
      <Animated.View style={[tailwind`absolute bottom-0 left-0`, pattern2Style]}>
        <Image
          source={require('../../welcome/assets/pattern2.png')}
          style={[tailwind`w-fit`, { transform: [{ scaleX: -1 }] }]}
        />
      </Animated.View>

      {/* Animated Text */}
      <Animated.View style={[textStyle, tailwind`mt-5 w-full items-start`]}>
        <Text style={tailwind`text-4xl font-bold mt-3 text-white text-left`}>
          Create Account
        </Text>
        <Text style={tailwind`text-2xl font-bold text-[#00347D]`}>
          Sign up to get started
        </Text>
      </Animated.View>

      {/* Form */}
      <View style={tailwind`w-full`}>
        {/* Name Input */}
        <View style={tailwind`relative`}>
          <View style={tailwind`absolute z-2 inset-y-0 left-5 top-9 flex items-center`}>
            <Icon name="account" size={20} color="#888" />
          </View>
          <TextInput
            placeholder="Name"
            style={tailwind`bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-1.5`}
            outlineStyle={tailwind`border rounded-xl `}            value={name.value}
            onChangeText={(text) => setName({ value: text, error: '' })}
            errorText={name.error}
          />
        </View>

        {/* Email Input */}
        <View style={tailwind`relative `}>
          <View style={tailwind`absolute z-2 inset-y-0 left-5 top-9 flex items-center`}>
            <Icon name="email" size={20} color="#888" />
          </View>
          <TextInput
            placeholder="Email"
            style={tailwind`bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-1.5`}
            outlineStyle={tailwind`border rounded-xl `}            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: '' })}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            errorText={email.error}
          />
        </View>

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

      {/* Animated Buttons */}
      <Animated.View style={buttonStyle}>
        <Button
          mode="contained"
          style={tailwind`bg-[#00347D] text-[#FEA928] text-xl mt-4`}
          onPress={onSignUpPressed}
        >
          <Text style={tailwind`text-xl text-[#FEA928] font-bold`}>Sign Up</Text>
        </Button>

        <View style={tailwind`flex-row justify-center mt-4`}>
          <Text style={tailwind`text-lg text-white`}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
            <Text style={tailwind`text-lg font-bold text-[#00347D]`}>Sign In!</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
