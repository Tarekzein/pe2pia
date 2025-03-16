import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import HomeHeader from '../../components/home/HomeHeader.tsx';
import Card from '../../components/home/Card.tsx';
import PostOverlay from '../../components/home/PostOverlay.tsx';
import CommentsOverlay from '../../components/home/CommentsOverlay.tsx';
import { useTheme } from '../../../../context/ThemeContext.tsx';
import { useHome } from '../../context/HomeContext';
import { useAuth } from '../../../../context/AuthContext';
import CardSkeleton from '../../components/home/CardSkeleton';
import Material from 'react-native-vector-icons/MaterialCommunityIcons.js';
import { useFocusEffect } from '@react-navigation/native';

interface HomeScreenProps {
    navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { theme } = useTheme();
    const { posts, postsLoading, commentsLoading, fetchPosts, likePost, fetchPostComments, postComments } = useHome();
    const { user } = useAuth();
    const isDarkMode = theme === 'dark';

    const [selectedPost, setSelectedPost] = useState<any>();
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [commentsOverlayVisible, setCommentsOverlayVisible] = useState(false);
    const [categories] = useState([
        { name: 'all', icon: 'format-align-justify' },
        { name: 'cats', icon: 'cat' },
        { name: 'dogs', icon: 'dog' },
        { name: 'birds', icon: 'bird' },
        { name: 'turtles', icon: 'turtle' },
        { name: 'fishes', icon: 'fish' },
        { name: 'others', icon: 'dots-horizontal' },
    ]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Create a ref for the ScrollView
    const scrollViewRef = useRef<ScrollView>(null);

    // Fetch posts when the selected category changes.
    useEffect(() => {
        fetchPosts(selectedCategory === 'all' ? '' : selectedCategory);
    }, [selectedCategory]);

    // Listen for the tab press event to scroll to top and refresh
    useEffect(() => {
        console.log('Adding listener');
        const unsubscribe = navigation.addListener('tabPress', () => {
            console.log('Tab pressed');
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0, animated: true });
            }
            fetchPosts(selectedCategory === 'all' ? '' : selectedCategory);
        });
        console.log(unsubscribe);
        return unsubscribe;
    }, [navigation, selectedCategory, fetchPosts]);

    // // Optional: Also use useFocusEffect to handle screen focus
    // useFocusEffect(
    //   useCallback(() => {
    //       console.log('Screen focused');
    //       if (scrollViewRef.current) {
    //           scrollViewRef.current.scrollTo({ y: 0, animated: true });
    //       }
    //       fetchPosts(selectedCategory === 'all' ? '' : selectedCategory);
    //   }, [selectedCategory])
    // );

    const handlePostClick = (post: any) => {
        setSelectedPost(post);
        setOverlayVisible(true);
    };
    const handleCommentsClick = async (post: any) => {
        try {
            setCommentsOverlayVisible(true);
            fetchPostComments(post._id);
            setSelectedPost(post);
        } catch (e) {
            console.log(e);
        }
    };
    const handleOverlayClose = () => {
        setOverlayVisible(false);
        setCommentsOverlayVisible(false);
        setSelectedPost(null);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    return (
      <View style={[tailwind`flex-1`, isDarkMode ? tailwind`bg-gray-900` : '']}>
          <HomeHeader navigation={navigation} />
          {/* Sticky Navigation Bar */}
          <View
            style={[
                tailwind`flex-row p-4 justify-between items-center shadow-md sticky top-0 z-10`,
                isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-[#FFF8EC]`,
            ]}
          >
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => `category-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => handleCategoryChange(item.name)}
                    style={[
                        tailwind`w-12 h-12 rounded-full border flex justify-center items-center mx-auto`,
                        isDarkMode
                          ? tailwind`bg-gray-700 border ${selectedCategory === item.name ? 'border-[#FEA928]' : 'border-gray-700'}`
                          : tailwind`bg-gray-200 border ${selectedCategory === item.name ? 'border-[#FEA928]' : 'border-gray-700'}`,
                    ]}
                  >
                      <Material
                        name={item.icon}
                        size={25}
                        color={selectedCategory === item.name ? '#FEA928' : (isDarkMode ? '#FFF8EC' : '#374151')}
                      />
                  </TouchableOpacity>
                )}
                contentContainerStyle={tailwind`flex-1 justify-between`}
              />
          </View>
          <ScrollView
            ref={scrollViewRef}
            style={tailwind`flex-1`}
            contentContainerStyle={tailwind`py-2`}
            showsVerticalScrollIndicator={false}
          >
              <View>
                  {postsLoading ? (
                    [...Array(4)].map((_, index) => (
                      <CardSkeleton key={index} isDarkMode={isDarkMode} />
                    ))
                  ) : (
                    posts.map(
                      (post, index) =>
                        post.isAccepted && (
                          <Card
                            key={index}
                            post={post}
                            userId={user.id}
                            likePost={likePost}
                            onPostClick={() => handlePostClick(post)}
                            onCommentsClick={handleCommentsClick}
                          />
                        )
                    )
                  )}
              </View>
          </ScrollView>

          {/* Post Overlay */}
          {selectedPost && (
            <PostOverlay
              visible={overlayVisible}
              post={selectedPost}
              isDarkMode={isDarkMode}
              onClose={handleOverlayClose}
            />
          )}
          {postComments && (
            <CommentsOverlay
              visible={commentsOverlayVisible}
              loading={commentsLoading}
              comments={postComments}
              postId={selectedPost?._id}
              isDarkMode={isDarkMode}
              onClose={handleOverlayClose}
            />
          )}
      </View>
    );
};

export default HomeScreen;
