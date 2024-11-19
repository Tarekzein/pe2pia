import React from 'react';
import { View, ScrollView } from 'react-native';
import tailwind from 'twrnc';
import HomeHeader from '../components/home/HomeHeader';
import Card from '../components/home/Card';

const HomeScreen: React.FC = () => {
  return (
    <View style={tailwind`flex-1`}>
      {/* Header */}
      <HomeHeader />

      {/* Content */}
      <ScrollView
        style={tailwind`flex-1`}
        contentContainerStyle={tailwind`py-4`}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Navigation Bar (Placeholder for the icons row) */}
        <View style={tailwind`flex-row bg-[#FFF8EC] p-4 justify-between items-center mb-4`}>
          {[...Array(6)].map((_, index) => (
            <View
              key={index}
              style={tailwind`w-10 h-10 bg-gray-300 rounded-full`}
            />
          ))}
        </View>

        {/* Section 2: Posts */}
        <View>
          {/* Card 1 */}
          <Card
            username="Username 1"
            category="Turtles"
            contentType="image"
            content="" // Replace with image URL when using real data
            likes={150}
            comments={60}
            shares={3}
          />

          {/* Card 2 */}
          <Card
            username="Username 2"
            category="Birds"
            contentType="text"
            content="The text what username shares will appear here."
            likes={90}
            comments={10}
            shares={5}
          />

          {/* Add more cards here */}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
