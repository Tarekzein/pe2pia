import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../../context/ThemeContext';
import ImageGrid from './ImageGrid';

interface CardProps {
  post: any
  onPostClick?: () => void;
  onCommentsClick: (post:any) => void;
  userId: string;
  likePost: (postId: string) => void;
  onEditPost?: () => void;
  onDeletePost?: () => void;
}

const Card: React.FC<CardProps> = ({
                                     post,
                                     onPostClick,
                                     onCommentsClick,
                                     userId,
                                     likePost,
                                     onEditPost,
                                     onDeletePost
                                   }) => {
  const { theme } = useTheme();
  const [isLiked, setIsLiked] = useState(!!post.likes.find((like: any) => like === userId));
  const [isModalVisible, setModalVisible] = useState(false);

  const isDarkMode = theme === 'dark';
  const backgroundColor = isDarkMode ? tailwind`bg-gray-800`.backgroundColor : '#FFF8EC';
  const textColorPrimary = isDarkMode ? '#FEA928' : '#00347D';
  const textColorSecondary = isDarkMode ? '#FFF8EC' : '#FFB300';
  const iconColor = isDarkMode ? '#FEA928' : '#FFB300';
  const borderColor = isDarkMode ? '#eeeeee54' : '#D1D5DB';

  const handleLike = (isLiked: boolean | undefined) => {
    try {
      if (likePost) {
        likePost(post._id);
      }
      setIsLiked(!isLiked);
    } catch (e) {
      console.log(e);
    }
  };

  const handleActionSheet = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleEditPost = () => {
    handleModalClose();
    onEditPost && onEditPost();
  };

  const handleDeletePost = () => {
    handleModalClose();
    onDeletePost && onDeletePost();
  };

  return (
    <View style={[tailwind`mb-1  p-4`, {backgroundColor}]}>
      {/* User Info */}
      <View style={tailwind`flex-row justify-between items-start`}>
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
        {post.user._id===userId && (
            <TouchableOpacity onPress={handleActionSheet}>
              <Icon name="more-horizontal" size={28} color={textColorSecondary} />
            </TouchableOpacity>
          )
        }

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

      {/* Bottom Sheet Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={handleModalClose}
        onSwipeComplete={handleModalClose}
        swipeDirection={['down']}
        style={tailwind`justify-end m-0`}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
      >
        <View
          style={[
            tailwind`bg-white rounded-t-3xl p-6`,
            isDarkMode ? tailwind`bg-gray-800` : '',
            { paddingBottom: 40 }
          ]}
        >
          {/* Drag Handle */}
          <View
            style={[
              tailwind`self-center w-12 h-1 rounded-full mb-6`,
              isDarkMode ? tailwind`bg-gray-600` : tailwind`bg-gray-300`
            ]}
          />

          {/* Modal Options */}
          <TouchableOpacity
            onPress={handleEditPost}
            style={tailwind`flex-row items-center py-4 border-b border-gray-200`}
          >
            <Icon
              name="edit"
              size={24}
              color={isDarkMode ? '#FEA928' : '#00347D'}
              style={tailwind`mr-4`}
            />
            <Text
              style={[
                tailwind`text-lg`,
                isDarkMode ? tailwind`text-gray-100` : tailwind`text-[#00347D]`
              ]}
            >
              Edit Post
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeletePost}
            style={tailwind`flex-row items-center py-4`}
          >
            <Icon
              name="trash-2"
              size={24}
              color="#F44336"
              style={tailwind`mr-4`}
            />
            <Text
              style={[
                tailwind`text-lg text-red-500`,
                isDarkMode ? tailwind`text-red-400` : ''
              ]}
            >
              Delete Post
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Card;
