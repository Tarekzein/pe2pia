import {Text, View} from 'react-native';
import tailwind from 'twrnc';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';


const informationCard = () => {
  return (
    <View>
      <View style={tailwind`flex-col items-center`}>
        <View style={tailwind`mt-5`}>
          <View style={tailwind`w-30 h-30 rounded-full bg-gray-200`} />
        </View>
        <Text style={tailwind`text-[#00347D] text-xl font-bold mt-5`}>First Name Last Name</Text>
        <View style={tailwind`flex-row items-center mt-2`}>
          <Icon name="map-pin" size={20}  color="#FEA928" />
          <Text style={tailwind`text-[#00347D] ml-2 font-bold text-lg `}>Giza</Text>
        </View>
      </View>
      <View style={tailwind`flex-row items-center justify-evenly mt-5`}>
        <View style={tailwind`flex-col items-center justify-center`}>
          <Text style={tailwind`text-[#FEA928] ml-2 font-bold text-xl`}>385</Text>
          <Text style={tailwind`text-[#00347D] ml-2 text-xl`}>Following</Text>
        </View>
        <View style={tailwind`flex-col items-center justify-center`}>
          <Text style={tailwind`text-[#FEA928] ml-2 font-bold text-xl`}>385</Text>
          <Text style={tailwind`text-[#00347D] ml-2 text-xl`}>Followers</Text>
        </View>
      </View>
    </View>
  );

}

export default informationCard;
