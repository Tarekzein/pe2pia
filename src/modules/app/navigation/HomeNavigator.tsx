import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { RouteProp, useRoute, NavigationProp } from '@react-navigation/native';
import HomeScreen from '../screens/home/HomeScreen';
import CreatePostScreen from '../screens/home/CreatePostScreen';
import { HomeProvider } from '../context/HomeContext';

// Define your stack param list
type HomeStackParamList = {
  Home: { type?: string };
  CreatePost: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

type HomeNavigatorProps = {
  navigation: NavigationProp<HomeStackParamList>;
};

const HomeNavigator: React.FC<HomeNavigatorProps> = ({ navigation }) => {
  const route = useRoute<RouteProp<HomeStackParamList, 'Home'>>();

  useEffect(() => {
    // Check if the route params indicate a double tap
    if (route.params?.type === 'doubleTabPress') {
      console.log('Double tap detected!');
      // Reset params to prevent repeated triggers
      navigation.setParams({ type: undefined });

      // You can add any additional logic here if needed
    }
  }, [route.params, navigation]);

  return (
    <HomeProvider>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-Medium',
          },
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePostScreen}
        />
      </Stack.Navigator>
    </HomeProvider>
  );
}

export default HomeNavigator;
