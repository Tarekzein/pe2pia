import React, {useEffect, useState} from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'
import {useAuth} from '../../../context/AuthContext';
import tailwind from "twrnc";
import {Image, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {Text} from "react-native-paper";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
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


  const {forgotPassword} = useAuth();
  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return;
    }
    try {
      // Logic to send password reset email goes here
      forgotPassword(email.value);
      console.log("Password reset email sent");
    }catch (error) {
      console.error(error);
    }finally {
      // Navigate to the OTP screen
      navigation.navigate('OtpScreen');
    }
  }

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
                  Restore Password.
              </Text>
              <Animated.View style={[tailwind`flex flex-row items-center`]}>
                  <Text style={tailwind`text-xl font-bold text-[#00347D]`}>
                      You will receive email with password reset link.
                  </Text>
              </Animated.View>
          </Animated.View>

          <View style={tailwind`w-full mt-5`}>
              {/* Email Input */}
              <View style={tailwind`relative `}>
                  {/* Email Icon */}
                  <Icon
                      name="email"
                      size={20}
                      color="#888"
                      style={tailwind`absolute z-2 inset-y-0 left-5 top-9 flex items-center`}
                  />
                  <TextInput
                      placeholder="Email"
                      style={tailwind`bg-gray-50   text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-1.5`}
                      value={email.value}
                      onChangeText={(text) => setEmail({ value: text, error: '' })}
                      autoCapitalize="none"
                      autoCompleteType="email"
                      textContentType="emailAddress"
                      keyboardType="email-address"
                      errorText={email.error}
                      outlineStyle={tailwind`border rounded-xl `}
                  />

              </View>

              <Button mode="contained"
                      style={tailwind`bg-[#00347D] text-[#FEA928] text-xl mt-4`}
                      onPress={sendResetPasswordEmail}>
                  <Text style={tailwind`text-xl text-[#FEA928] font-bold`}>
                      Send OTP
                  </Text>
              </Button>

          </View>
      </View>
  );
}
