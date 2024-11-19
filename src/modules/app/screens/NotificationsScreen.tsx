import React from 'react';
import { View, Text } from 'react-native';
import tailwind from 'twrnc';
interface HomeScreenProps {
  navigation: any;
}

const NotificationsScreen: React.FC<HomeScreenProps>  = ({}) => {
  return (
    <View >
      <Text >Notifications Screen</Text>
    </View>
  );
}

export default NotificationsScreen;
