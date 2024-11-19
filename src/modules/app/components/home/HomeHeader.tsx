import React from 'react';
import { View, Text, Image } from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';

const HomeHeader: React.FC = () => {
  return (
    <View style={tailwind`bg-[#FFF8EC] p-4 rounded-lg`}>
      {/* Top Section with Logo */}
      <View style={[tailwind`flex flex-row items-center`]}>
        <Text style={tailwind`text-[2.5rem] font-bold text-[#FEA928]`}>Pe</Text>
        <Image
          source={require('../../../welcome/assets/3.png')}
          style={tailwind`w-9 h-9 `} // Smaller, responsive image
          resizeMode="contain" // Ensures the image scales correctly
        />
        <Text style={tailwind`text-[2.5rem] font-bold text-[#FEA928]`}>pia</Text>
      </View>

      {/* Input and Icon Row */}
      <View style={tailwind`flex-row items-center mt-2`}>
        <View style={tailwind`w-10 h-10 bg-gray-300 rounded-full`} />
        <Text style={tailwind`text-[#00347D] ml-4 text-base`}>What do you have to share?</Text>
        <View style={tailwind`ml-auto w-8 h-8 rounded-full flex items-center justify-center`}>
          <Icon name={ 'image' } size={30} color={'#FEA928'} />
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
