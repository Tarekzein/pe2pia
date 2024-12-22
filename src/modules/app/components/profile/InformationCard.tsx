import {Image, Text, View} from 'react-native';
import tailwind from 'twrnc';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';

interface InformationCardProps {
  isDarkMode: boolean;
  user: any;
}

const informationCard:React.FC<InformationCardProps> = ({isDarkMode,user}) => {
  return (
    <View>
      <View style={tailwind`flex-col items-center`}>
        <View style={tailwind`mt-5`}>
          <Image source={{uri:user.profilePicture.url}} style={[tailwind`w-30 h-30 rounded-full `,
            isDarkMode ? tailwind`bg-gray-600` : tailwind`bg-gray-200`
          ]} />
        </View>
        <Text style={[tailwind`text-xl font-bold mt-5`,
          isDarkMode ? tailwind`text-white` : tailwind`text-[#00347D]`
        ]}>{user.FirstName} {user.LastName} </Text>
        <View style={tailwind`flex-row items-center mt-2`}>
          <Icon name="map-pin" size={17}  color="#FEA928" />
          <Text style={[tailwind`text-[#00347D] ml-1 font-bold text-lg`,
            isDarkMode ? tailwind`text-white` : tailwind`text-[#00347D]`
          ]}>{user.bio}</Text>
        </View>
      </View>
      <View style={tailwind`flex-row items-center justify-evenly mt-5`}>
        <View style={tailwind`flex-col items-center justify-center`}>
          <Text style={tailwind`text-[#FEA928] ml-2 font-bold text-xl`}>{user.following.length}</Text>
          <Text style={[tailwind`text-[#00347D] ml-2 text-xl`,
            isDarkMode ? tailwind`text-white` : tailwind`text-[#00347D]`
          ]}>Following</Text>
        </View>
        <View style={tailwind`flex-col items-center justify-center`}>
          <Text style={tailwind`text-[#FEA928] ml-2 font-bold text-xl`}>{user.followers.length}</Text>
          <Text style={[tailwind`text-[#00347D] ml-2 text-xl`,
            isDarkMode ? tailwind`text-white` : tailwind`text-[#00347D]`
          ]}>Followers</Text>
        </View>
      </View>
    </View>
  );

}

export default informationCard;
