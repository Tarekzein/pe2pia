import React, { useEffect, memo } from 'react';
import { View, Text } from 'react-native';
import tailwind from 'twrnc';
import { useProfile } from '../../context/ProfileContext';
import Card from "../home/Card";
import CardSkeleton from "../home/CardSkeleton";
import {useFocusEffect} from '@react-navigation/native';

interface UserPostsProps {
  userID: string;
  isDarkMode?: boolean;
}

// Memoized Post component
const Post = memo(({ post}: { post: any}) => (
  <Card
    post={post}
    onCommentsClick={() => {}} // Add proper handler
    userId={post.userId}
    likePost={() => {}} // Add proper handler
  />
));

const UserPosts: React.FC<UserPostsProps> = ({ userID, isDarkMode }) => {
  const { userPosts, fetchUserPosts, loading } = useProfile();

  useEffect(() => {
    if (userID) {
      fetchUserPosts(userID);
    }
  }, []);

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
      </Text>

      {userPosts && userPosts.length > 0 ? (
        <View style={[tailwind`py-1 `,
          isDarkMode ? tailwind`bg-gray-900` : tailwind`bg-gray-100`,

        ]}>
          {userPosts.map((post: {_id: React.Key | null | undefined}) => (
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
            No posts yet
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
