import React, { useEffect, useState, useRef } from 'react';
import {View, ScrollView, FlatList, TouchableOpacity, RefreshControl} from 'react-native';
import {
  useRoute,
  RouteProp,
  NavigationProp
} from '@react-navigation/native';
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

// Define your stack param list (same as in HomeNavigator)
type HomeStackParamList = {
  Home: { type?: string };
  CreatePost: undefined;
};

interface HomeScreenProps {
  navigation: NavigationProp<HomeStackParamList>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { posts, postsLoading, commentsLoading, fetchPosts,deletePost, likePost, fetchPostComments, postComments,followUser,unfollowUser } = useHome();
  const { user } = useAuth();
  const isDarkMode = theme === 'dark';
  const route = useRoute<RouteProp<HomeStackParamList, 'Home'>>();
  const scrollViewRef = useRef<ScrollView>(null);
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
  const [refreshing, setRefreshing] = useState(false);

  // Fetch posts when the selected category changes
  useEffect(() => {
    fetchPosts(selectedCategory === 'all' ? '' : selectedCategory);
  }, [selectedCategory]);

  // Handle double tap to refresh
  useEffect(() => {
    const handleDoubleTap = async () => {
      try {
        // Scroll to top
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }

        // Set refreshing state
        setRefreshing(true);

        // Fetch posts
        fetchPosts(selectedCategory === 'all' ? '' : selectedCategory);
      } catch (error) {
        console.error('Error refreshing posts:', error);
      } finally {
        // Ensure refreshing state is reset
        setRefreshing(false);
      }
    };

    // Check if the route params indicate a double tap
    if (route.params?.type === 'doubleTabPress') {
      console.log('Double tap detected!');
      handleDoubleTap();

      // Clear the params to prevent repeated triggers
      navigation.setParams({ type: undefined });
    }
  }, [route.params, navigation, selectedCategory, fetchPosts]);

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

  const handleDeletePost = async (postId: string) => {
    try {
      // Call the delete post function from the context
      deletePost(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  const handleFollowUser = async (data: any) => {
    try {
      // Call the follow user function from the context
      followUser(data);
    } catch (error) {
      console.error('Error following user:', error);
    }
  }

  const handleUnfollowUser = async (data: any) => {
    try {
      // Call the unfollow user function from the context
      unfollowUser(data);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  }

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
        contentContainerStyle={[
          tailwind`py-2`,
          { minHeight: '100%' } // Ensure the ScrollView has enough height
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              try {
                // Fetch posts
                fetchPosts(selectedCategory === 'all' ? '' : selectedCategory);
              } catch (error) {
                console.error('Error refreshing posts:', error);
              }
            }}
            colors={['#FEA928']}
          />
        }
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
                    onDeletePost={handleDeletePost}
                    followUser={handleFollowUser}
                    unfollowUser={handleUnfollowUser}
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
