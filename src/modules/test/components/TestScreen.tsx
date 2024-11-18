// src/screens/Offer/OfferScreen.js

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Header from '../../../components/Header';
import TabBar from '../../../components/TabBar';
import CardComponent from '../../../components/CardComponent';
import NavigationBar from '../../../components/NavigationBar';

// @ts-ignore
const TestScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Active');

  const handleTabPress = (tab: React.SetStateAction<string>) =>
    setActiveTab(tab);

  return (
    <View style={styles.container}>
      <Header
        title="Work Order"
        onBackPress={() => navigation.goBack()}
        onMenuPress={undefined}
      />
      <TabBar
        tabs={['Active', 'Done']}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Example of rendering OfferCards */}
        <CardComponent
          name="Service Name"
          service="Service Type"
          rating={4}
          image={{uri: 'https://example.com/image.jpg'}}
          providerImage={{uri: 'https://example.com/provider.jpg'}}
          navigation={navigation}
          Details={undefined}
        />
        <CardComponent
          name="Service Name"
          service="Service Type"
          rating={4}
          image={{uri: 'https://example.com/image.jpg'}}
          providerImage={{uri: 'https://example.com/provider.jpg'}}
          navigation={navigation}
          Details={undefined}
        />
        <CardComponent
          name="Service Name"
          service="Service Type"
          rating={4}
          image={{uri: 'https://example.com/image.jpg'}}
          providerImage={{uri: 'https://example.com/provider.jpg'}}
          navigation={navigation}
          Details={undefined}
        />
        <CardComponent
          name="Service Name"
          service="Service Type"
          rating={4}
          image={{uri: 'https://example.com/image.jpg'}}
          providerImage={{uri: 'https://example.com/provider.jpg'}}
          navigation={navigation}
          Details={undefined}
        />
        <CardComponent
          name="Service Name"
          service="Service Type"
          rating={4}
          image={{uri: 'https://example.com/image.jpg'}}
          providerImage={{uri: 'https://example.com/provider.jpg'}}
          navigation={navigation}
          Details={undefined}
        />
        {/* You can map over a list of offers here to render multiple OfferCards */}
      </ScrollView>
      <NavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  content: {
    paddingVertical: 20,
    paddingBottom:120,
  },
});

export default TestScreen;
