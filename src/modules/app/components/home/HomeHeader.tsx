import React from 'react';
import {View, Text, Image, TouchableOpacity,StatusBar} from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../../context/ThemeContext';
import { useAuth } from '../../../../context/AuthContext';
import * as url from "node:url";

interface HomeHeaderProps {
    navigation: any;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({navigation}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDarkMode = theme === 'dark';
  const backgroundColor = isDarkMode ? tailwind`bg-gray-800`.backgroundColor : '#FFF8EC';

  return (
    <View
      style={[
        tailwind`p-4`,
        {
          backgroundColor,
        },
      ]}>
      {/* Top Section with Logo */}
      <View style={[tailwind`flex flex-row items-center`]}>
        <Text style={tailwind`text-[2.5rem] font-bold text-[#FEA928]`}>Pe</Text>
        <Image
          source={require('../../../welcome/assets/3.png')}
          style={tailwind`w-9 h-9 `} // Smaller, responsive image
          resizeMode="contain" // Ensures the image scales correctly
        />
        <Text style={tailwind`text-[2.5rem] font-bold text-[#FEA928]`}>
          pia
        </Text>
      </View>

      {/* Input and Icon Row */}
      <View style={tailwind`flex-row items-center mt-2`}>
        <Image
          source={{uri: user?.profilePicture?.url}}
          style={tailwind`w-10 h-10  rounded-full`}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CreatePost');
          }}>
          <Text
            style={[
              tailwind`ml-4 text-base`,
              isDarkMode ? tailwind`text-gray-300` : tailwind`text-[#00347D]`,
            ]}>
            What do you have to share?
          </Text>
        </TouchableOpacity>
        <View
          style={tailwind`ml-auto w-8 h-8 rounded-full flex items-center justify-center`}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CreatePost');
            }}>
            <Icon name={'image'} size={30} color={'#FEA928'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
