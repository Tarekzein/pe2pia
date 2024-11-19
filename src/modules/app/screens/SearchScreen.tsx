import React from 'react';
import { View, Text } from 'react-native';
import tailwind from 'twrnc';
interface HomeScreenProps {
  navigation: any;
}

const SearchScreen: React.FC<HomeScreenProps>  = ({}) => {
  return (
    <View >
      <Text >Search Screen</Text>
    </View>
  );
}

export default SearchScreen;
