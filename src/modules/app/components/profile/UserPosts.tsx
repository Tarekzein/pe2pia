import React, { memo } from 'react';
import { View, Text } from 'react-native';
import tailwind from 'twrnc';
import { useProfile } from '../../context/ProfileContext';
import Card from "../home/Card";
import CardSkeleton from "../home/CardSkeleton";
import { useFocusEffect } from '@react-navigation/native';

interface UserPostsProps {
  userID: string;
  user: any;
  isDarkMode?: boolean;
}

// Memoized Post component
const Post = memo(({ post }: { post: any }) => (
  <Card
    post={post}
    onCommentsClick={() => {}} // Add proper handler
    userId={post.user._id}
    likePost={() => {}} // Add proper handler
  />
));

const UserPosts: React.FC<UserPostsProps> = ({ userID, user, isDarkMode }) => {
  const { userPosts, fetchUserPosts, loading } = useProfile();

  // Use useFocusEffect for better performance
  useFocusEffect(
    React.useCallback(() => {
      if (userID) {
        fetchUserPosts(userID);
      }
    }, [userID])
  );

  // Filter posts based on user ID and acceptance status
  const filteredPosts = React.useMemo(() => {
    if (!userPosts) {return [];}

    return userPosts.filter((post: {isAccepted: boolean}) => {
      // If viewing own profile, show all posts
      if (userID === user._id) {
        return true;
      }
      // If viewing other's profile, only show accepted posts
      return post.isAccepted;
    });
  }, [userPosts, userID, user._id]);

  if (loading) {
    return <PostsSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <View
      style={[
        tailwind`flex-1 border-t border-[#FEA928] mt-2`,
        isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-[#FFF8EC]`,
      ]}>
      <Text
        style={[
          tailwind`text-lg text-center font-bold px-4 py-3`,
          isDarkMode ? tailwind`text-[#FEA928]` : tailwind`text-[#00347D]`,
        ]}>
        Posts
        {userID === user._id && userPosts && userPosts.length !== filteredPosts.length && (
          <Text style={tailwind`text-sm text-gray-500`}>
            {` (${filteredPosts.length} public, ${userPosts.length - filteredPosts.length} pending)`}
          </Text>
        )}
      </Text>

      {filteredPosts.length > 0 ? (
        <View style={[
          tailwind`py-1`,
          isDarkMode ? tailwind`bg-gray-900` : tailwind`bg-gray-100`,
        ]}>
          {filteredPosts.map((post: { _id: React.Key | null | undefined }) => (
            <Post key={post._id} post={post} />
          ))}
        </View>
      ) : (
        <View style={tailwind`flex-1 justify-center items-center py-10`}>
          <Text
            style={[
              tailwind`text-gray-500 text-center`,
              isDarkMode && tailwind`text-gray-400`,
            ]}>
            {userID === user._id ?
              'You haven\'t posted anything yet' :
              'No posts available'
            }
          </Text>
        </View>
      )}
    </View>
  );
};

const PostsSkeleton = memo(({ isDarkMode }: { isDarkMode?: boolean }) => (
  <View style={tailwind`flex-1 px-2`}>
    {[...Array(9)].map((_, index) => (
      <CardSkeleton key={index} isDarkMode={isDarkMode} />
    ))}
  </View>
));

export default memo(UserPosts);
