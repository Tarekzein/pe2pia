import React, {useEffect} from 'react';
import { View, ScrollView } from 'react-native';
import tailwind from 'twrnc';
import HomeHeader from '../../components/home/HomeHeader.tsx';
import Card from '../../components/home/Card.tsx';
import { useTheme } from '../../../../context/ThemeContext.tsx';
import {useHome} from "../../context/HomeContext";
import CardSkeleton from "../../components/home/CardSkeleton";


const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { posts, loading, error, fetchPosts } = useHome();
  const isDarkMode = theme === 'dark';
  // const posts = [
  //   {
  //     username: 'Username 1',
  //     category: 'Turtles',
  //     contentType: 'image',
  //     content: '', // Replace with an image URL
  //     likes: 150,
  //     comments: 60,
  //     shares: 3,
  //   },
  //   {
  //     username: 'Username 2',
  //     category: 'Birds',
  //     contentType: 'text',
  //     content: 'The text what username shares will appear here.',
  //     likes: 90,
  //     comments: 10,
  //     shares: 5,
  //   },
  // ];

    useEffect(() => {
        fetchPosts(); // Fetch posts when the component mounts
    }, []);

  return (
    <View style={[tailwind`flex-1 `,isDarkMode? tailwind`bg-gray-900`:'']}>
      {/* Header */}
      <HomeHeader />

      {/* Sticky Navigation Bar */}
      <View
        style={[tailwind`flex-row p-4 justify-between items-center shadow-md sticky top-0 z-10`,
          isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-[#FFF8EC]`
        ]}
      >
        {[...Array(6)].map((_, index) => (
          <View
            key={index}
            style={[tailwind`w-10 h-10 rounded-full`,
              isDarkMode ? tailwind`bg-gray-700` : tailwind`bg-gray-300`
            ]}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={tailwind`flex-1`}
        contentContainerStyle={tailwind`py-4 px-2`}
        showsVerticalScrollIndicator={false}
      >
          {/* Posts */}
          <View>
              {loading ? (
                  [...Array(6)].map((_, index) => (
                      <CardSkeleton
                          isDarkMode={isDarkMode}
                      />
                  ))
              ) : (
                  posts.map((post, index) => (
                      <Card
                          key={index}
                          post={post}
                      />
                  ))
              )}
          </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
