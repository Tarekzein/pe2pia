import React, {useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet, View, Image} from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../../../core/theme';
import { emailValidator } from '../helpers/emailValidator';
import { passwordValidator } from '../helpers/passwordValidator';
import {useAuth} from '../../../hooks/AuthProvider';
import tailwind from 'twrnc';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const {login} = useAuth(login);
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
  const websiteStyle = useAnimatedStyle(() => ({
    opacity: websiteOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    // login(email.value, password.value);
  }

  return (
    <View
      style={[
        tailwind`flex-1 justify-evenly relative px-10 pt-10 items-center bg-[#FEA928]`,
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
          Welcome back.
        </Text>
        <Animated.View style={[tailwind`flex flex-row items-center`]}>
          <Text style={tailwind`text-2xl font-bold text-[#00347D]`}>
            Let’s sign in
          </Text>
        </Animated.View>
      </Animated.View>
      <View style={tailwind`w-full`}>
        <TextInput
          label="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: '' })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: '' })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
        />
        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
          >
            <Text style={tailwind`text-lg font-bold text-[#00347D]`}>Recover Password</Text>
          </TouchableOpacity>
        </View>
        <Button mode="contained"
                style={tailwind`bg-[#00347D] text-[#FEA928] text-xl mt-4`}
                onPress={onLoginPressed}>
          <Text style={tailwind`text-xl text-[#FEA928] font-bold`}>Sign In</Text>
        </Button>

      </View>
      {/* "or continue with" section */}
      <View style={tailwind`w-full items-center`}>
        <View style={tailwind`flex flex-row items-center`}>
          {/* Left Line */}
          <View style={tailwind`flex-1 border-t border-[#00347D]`} />

          {/* Text */}
          <Text style={tailwind`text-[#00347D] mx-4`}>or continue with</Text>

          {/* Right Line */}
          <View style={tailwind`flex-1 border-t border-[#00347D]`} />
        </View>
      </View>

      <View style={tailwind`w-full items-center`}>
        {/* Google Button */}
        <Button
          mode="contained"
          style={tailwind`bg-[#eee]`}
          onPress={onLoginPressed}
        >
          <View style={tailwind`flex-row items-center justify-between space-x-4`}>
            <Image source={require('../assets/google.png')} style={tailwind`w-6 h-6 mr-5`} />
            <Text style={tailwind`text-[#00347D]  text-lg font-bold`}>Continue with Google</Text>
          </View>
        </Button>

        {/* Facebook Button */}
        <Button
          mode="contained"
          style={tailwind`bg-[#eee]`}
          onPress={onLoginPressed}
        >
          <View style={tailwind`flex-row items-center justify-between space-x-4`}>
            <Image source={require('../assets/facebook.png')} style={tailwind`w-6 h-6 mr-5`} />
            <Text style={tailwind`text-[#00347D] text-lg font-bold`}>Continue with Facebook</Text>
          </View>
        </Button>

      </View>

      <View style={tailwind`flex-row`}>
        <Text style={tailwind`text-white text-lg`}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={tailwind`text-white text-lg font-bold text-[#00347D]`}>Sign up!</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
