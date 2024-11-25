import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import tailwind from 'twrnc';

const UserTabs = () => {
  const [activeTab, setActiveTab] = useState('posts'); // State to track active tab
  const postsData = Array(9).fill(null); // Data for Posts tab
  const likesData = Array(6).fill(null); // Data for Likes tab

  // Animated values for tab colors
  const postsColor = useRef(new Animated.Value(1)).current; // Default active
  const likesColor = useRef(new Animated.Value(0)).current;

  // Animated value for cards opacity
  const cardOpacity = useRef(new Animated.Value(1)).current;

  // Function to handle tab switching with animations
  const handleTabPress = (tab: React.SetStateAction<string>) => {
    if (activeTab !== tab) {
      setActiveTab(tab);

      // Animate tab colors
      Animated.timing(postsColor, {
        toValue: tab === 'posts' ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      Animated.timing(likesColor, {
        toValue: tab === 'likes' ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();

      // Animate cards opacity for smoother transition
      Animated.sequence([
        Animated.timing(cardOpacity, {
          toValue: 0, // Fade out cards
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1, // Fade in new cards
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Determine the data to display based on the active tab
  const data = activeTab === 'posts' ? postsData : likesData;

  return (
    <View style={tailwind`bg-beige flex-1`}>
      {/* Tabs Section */}
      <View style={tailwind`flex-row justify-around items-center border-t border-gray-300 pt-3 mt-4`}>
        {/* Posts Tab */}
        <TouchableOpacity
          style={tailwind`flex-1 items-center`}
          onPress={() => handleTabPress('posts')}
        >
          <Animated.Text
            style={[
              tailwind`font-bold`,
              {
                color: postsColor.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#9CA3AF', '#FEA928'], // Gray to Orange
                }),
              },
            ]}
          >
            POSTS
          </Animated.Text>
          {activeTab === 'posts' && <View style={tailwind`w-full h-1 bg-[#FEA928] mt-1`} />}
        </TouchableOpacity>

        {/* Likes Tab */}
        <TouchableOpacity
          style={tailwind`flex-1 items-center`}
          onPress={() => handleTabPress('likes')}
        >
          <Animated.Text
            style={[
              tailwind`font-bold`,
              {
                color: likesColor.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#9CA3AF', '#FEA928'], // Gray to Orange
                }),
              },
            ]}
          >
            LIKES
          </Animated.Text>
          {activeTab === 'likes' && <View style={tailwind`w-full h-1 bg-[#FEA928] mt-1`} />}
        </TouchableOpacity>
      </View>

      {/* Grid Section */}
      <ScrollView style={tailwind`px-5`}>
        <Animated.FlatList
          data={data}
          numColumns={3}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => (
            <Animated.View
              style={[
                tailwind`flex-1 aspect-square m-2 bg-gray-200 rounded-5 shadow-sm`,
                { opacity: cardOpacity },
              ]}
            />
          )}
          contentContainerStyle={tailwind`mt-4`}
          scrollEnabled={false} // Prevent internal scrolling inside FlatList
        />
      </ScrollView>
    </View>
  );
};

export default UserTabs;
