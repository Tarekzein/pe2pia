// src/screens/Offer/OfferScreen.js

import React from 'react';
import { View } from 'react-native';
import tailwind from 'twrnc';
import NavigationBar from '../../../components/NavigationBar';
import Button from '../../../modules/auth/components/Button';
import { useAuth } from '../../../hooks/AuthProvider';
import Logo from '../../../modules/auth/components/Logo';
import Header from '../../../modules/auth/components/Header';
import Paragraph from '../../../modules/auth/components/Paragraph';
import Background from '../../../modules/auth/components/Background';
import { Card, CardContent, CardImage, CardSubtitle, CardText, CardTitle } from '../../../components/card';

const EmptyScreen = ({ navigation }) => {
  const { logout } = useAuth();

  const onLogoutPressed = () => {
    logout();
  };

  return (
    <View style={tailwind`flex-1 bg-gray-200`}>
      <Background>
        <Logo />
        <Header>Let’s start</Header>
        <Paragraph>
          Your amazing app starts here. Open your favorite code editor and start editing this project.
        </Paragraph>

        <Card style={tailwind`w-full max-w-sm`}>
          <CardContent style={tailwind`gap-1`}>
            <CardTitle>This is a card</CardTitle>
            <CardText>You can use it to display information</CardText>
          </CardContent>
          <CardImage source={{ uri: "https://picsum.photos/700" }} />
          <CardContent style={tailwind`gap-1`}>
            <CardSubtitle>Posted by @worldtraveller</CardSubtitle>
            <CardText>2 hours ago</CardText>
          </CardContent>
        </Card>

        <Button mode="outlined" onPress={onLogoutPressed} style={tailwind`mt-5`}>
          Logout
        </Button>
      </Background>

      <NavigationBar navigation={navigation} />
    </View>
  );
};

export default EmptyScreen;
