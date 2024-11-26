import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import InformationCard from '../../components/profile/InformationCard.tsx';
import UserTabs from '../../components/profile/UserTabs.tsx';
interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps>  = ({navigation}) => {
  return (
    <View style={tailwind`flex-1 bg-[#FFF8EC]`}>
      {/* Header */}
      <View style={tailwind`flex-row justify-between items-center mt-5 mx-5`}>
        <Icon name="arrow-left" size={30} color="#00347D" onPress={() => navigation.goBack()} />
        <TouchableOpacity style={tailwind`flex-row items-center`} onPress={()=>navigation.navigate('Settings')}>
          <Icon name="settings" size={25} color="#FEA928" />
        </TouchableOpacity>
      </View>

        {/* Profile */}
        <InformationCard />

        {/* Tabs */}
        <UserTabs />

    </View>
  );
}

export default ProfileScreen;
