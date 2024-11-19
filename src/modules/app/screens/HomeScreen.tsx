import React from 'react';
import { View, ScrollView } from 'react-native';
import tailwind from 'twrnc';
import HomeHeader from '../components/home/HomeHeader';
import Card from '../components/home/Card';

const HomeScreen: React.FC = () => {
  const posts = [
    {
      username: 'Username 1',
      category: 'Turtles',
      contentType: 'image',
      content: '', // Replace with an image URL
      likes: 150,
      comments: 60,
      shares: 3,
    },
    {
      username: 'Username 2',
      category: 'Birds',
      contentType: 'text',
      content: 'The text what username shares will appear here.',
      likes: 90,
      comments: 10,
      shares: 5,
    },
  ];

  return (
    <View style={tailwind`flex-1  dark:bg-gray-900`}>
      {/* Header */}
      <HomeHeader />

      {/* Sticky Navigation Bar */}
      <View
        style={tailwind`flex-row bg-[#FFF8EC] dark:bg-gray-800 p-4 justify-between items-center shadow-md sticky top-0 z-10`}
      >
        {[...Array(6)].map((_, index) => (
          <View
            key={index}
            style={tailwind`w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full`}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={tailwind`flex-1`}
        contentContainerStyle={tailwind`py-4`}
        showsVerticalScrollIndicator={false}
      >
        {/* Posts */}
        <View>
          {posts.map((post, index) => (
            <Card
              key={index}
              username={post.username}
              category={post.category}
              contentType={post.contentType as 'image' | 'text'}
              content={post.content}
              likes={post.likes}
              comments={post.comments}
              shares={post.shares}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
