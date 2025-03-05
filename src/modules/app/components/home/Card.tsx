import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../../context/ThemeContext';
import ImageGrid from './ImageGrid';

interface CardProps {
    post: any
    onPostClick?: () => void;
    onCommentsClick: (post:any) => void;
    userId: string;
    likePost: (postId: string) => void;
}

const Card: React.FC<CardProps> = ({post,onPostClick,onCommentsClick,userId,likePost}) => {
    const { theme } = useTheme();
    const [isLiked, setIsLiked] = useState(!!post.likes.find((like: any) => like === userId));
    const isDarkMode = theme === 'dark';
    const backgroundColor = isDarkMode ? tailwind`bg-gray-800`.backgroundColor : '#FFF8EC';
    const textColorPrimary = isDarkMode ? '#FEA928' : '#00347D';
    const textColorSecondary = isDarkMode ? '#FFF8EC' : '#FFB300';
    const iconColor = isDarkMode ? '#FEA928' : '#FFB300';
    const borderColor = isDarkMode ? '#eeeeee54' : '#D1D5DB'; // Tailwind's gray-300
    const handleLike = (isLiked: boolean | undefined) => {
        try {
            if (likePost) {
                likePost(post._id);
            }
            setIsLiked(!isLiked);
        }catch (e) {
            console.log(e);
        }
    };
  return (
    <View style={[tailwind`mb-1  p-4`, {backgroundColor}]}>
      {/* User Info */}
      <View style={tailwind`flex-row justify-between items-center`}>
        <View style={tailwind`flex-row`}>
          <Image
            source={{uri: post.user.profilePicture.url}}
            style={[tailwind`w-10 h-10 mr-2 rounded-full`]}
          />
          <View>
            <Text
              style={[tailwind`text-lg font-bold`, {color: textColorPrimary}]}>
              {post.user.FirstName} {post.user.LastName}
            </Text>
            <Text style={[tailwind`text-sm`, {color: textColorSecondary}]}>
              {post.category}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Icon name="more-vertical" size={24} color={textColorSecondary} />
        </TouchableOpacity>
      </View>

      <Text
        style={[
          tailwind`mt-4 text-sm`,
          {color: isDarkMode ? '#D1D5DB' : '#374151'},
        ]}>
        {post.description}
      </Text>
      {/* Content */}
      {post.files.length && (
        <ImageGrid files={post.files} onPostClick={onPostClick} />
      )}

      {/* Action Buttons */}
      <View
        style={[
          tailwind`flex-row justify-evenly items-center mt-4 pt-4`,
          {borderTopWidth: 1, borderColor},
        ]}>
        <TouchableOpacity onPress={()=>handleLike(isLiked)}
          style={tailwind`flex-col justify-center items-center`}>
          {isLiked? <Material name={'cards-heart'} size={30} color={iconColor} /> : <Icon name="heart" size={30} color={iconColor} />}
          <Text
            style={[
              tailwind`text-sm`,
              {color: isDarkMode ? '#A1A1AA' : '#6B7280'},
            ]}>
            {post.likes.length}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>onCommentsClick(post)}
          style={tailwind`flex-col justify-center items-center`}>
          <Icon name="message-circle" size={30} color={iconColor} />
          <Text
            style={[
              tailwind`text-sm`,
              {color: isDarkMode ? '#A1A1AA' : '#6B7280'},
            ]}>
            {post.commentsCount ?? 0}
          </Text>
        </TouchableOpacity>
        {/*<TouchableOpacity style={tailwind`flex-col justify-center items-center`}>*/}
        {/*  <Icon name="share-2" size={30} color={iconColor} />*/}
        {/*  <Text style={[tailwind`text-sm`, { color: isDarkMode ? '#A1A1AA' : '#6B7280' }]}>*/}
        {/*    {post.shares ? post.shares.length:0}*/}
        {/*  </Text>*/}
        {/*</TouchableOpacity>*/}
      </View>
    </View>
  );
};

export default Card;
