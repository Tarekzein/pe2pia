import React from 'react';
import { View, Text } from 'react-native';
import tailwind from 'twrnc';
interface HomeScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<HomeScreenProps>  = ({}) => {
  return (
    <View >
      <Text >Profile Screen</Text>
    </View>
  );
}

export default ProfileScreen;
