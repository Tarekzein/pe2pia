import React from 'react';
import { View, Text } from 'react-native';
import tailwind from 'twrnc';
interface HomeScreenProps {
  navigation: any;
}

const ChatScreen: React.FC<HomeScreenProps>  = ({}) => {
  return (
    <View >
      <Text >Chat Screen</Text>
    </View>
  );
}

export default ChatScreen;
