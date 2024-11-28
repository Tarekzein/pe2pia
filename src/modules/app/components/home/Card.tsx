import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../../context/ThemeContext';

interface CardProps {
  username: string;
  category: string;
  contentType: 'image' | 'text';
  content: string; // Either an image URL or text content
  likes: number;
  comments: number;
  shares: number;
}

const Card: React.FC<CardProps> = ({
                                     username,
                                     category,
                                     contentType,
                                     content,
                                     likes,
                                     comments,
                                     shares,
                                   }) => {
  const { theme } = useTheme();

  const isDarkMode = theme === 'dark';
  const backgroundColor = isDarkMode ? tailwind`bg-gray-800`.backgroundColor : '#FFF8EC';
  const textColorPrimary = isDarkMode ? '#FEA928' : '#00347D';
  const textColorSecondary = isDarkMode ? '#FEA928' : '#FFB300';
  const iconColor = isDarkMode ? '#FEA928' : '#FFB300';
  const borderColor = isDarkMode ? '#eeeeee54' : '#D1D5DB'; // Tailwind's gray-300

  return (
    <View style={[tailwind`mb-2 rounded-xl p-4`, { backgroundColor }]}>
      {/* User Info */}
      <View style={tailwind`flex-row justify-between items-center`}>
        <View style={tailwind`flex-row`}>
          <View
            style={[
              tailwind`w-10 h-10 mr-2 rounded-full`,
              isDarkMode? tailwind`bg-gray-600`:tailwind`bg-gray-300`, // Tailwind's gray-300
            ]}
          />
          <View>
            <Text style={[tailwind`text-lg font-bold`, { color: textColorPrimary }]}>
              {username}
            </Text>
            <Text style={[tailwind`text-sm`, { color: textColorSecondary }]}>{category}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Icon name="more-vertical" size={24} color={textColorSecondary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {contentType === 'image' ? (
        <View
          style={[
            tailwind`mt-4 rounded-lg h-60 justify-center items-center`,
            isDarkMode? tailwind`bg-gray-600`:tailwind`bg-gray-300`, // Tailwind's gray-300
          ]}
        >
          {/* Replace with Image component when using real images */}
          <Text style={[tailwind`text-center`, { color: isDarkMode ? '#A1A1AA' : '#6B7280' }]}>
            Image Placeholder
          </Text>
        </View>
      ) : (
        <Text style={[tailwind`mt-4 text-sm`, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>
          {content}
        </Text>
      )}

      {/* Action Buttons */}
      <View
        style={[
          tailwind`flex-row justify-between items-center mt-4 pt-4`,
          { borderTopWidth: 1, borderColor },
        ]}
      >
        <TouchableOpacity style={tailwind`flex-col justify-center items-center`}>
          <Icon name="heart" size={30} color={iconColor} />
          <Text style={[tailwind`text-sm`, { color: isDarkMode ? '#A1A1AA' : '#6B7280' }]}>
            {likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={tailwind`flex-col justify-center items-center`}>
          <Icon name="message-circle" size={30} color={iconColor} />
          <Text style={[tailwind`text-sm`, { color: isDarkMode ? '#A1A1AA' : '#6B7280' }]}>
            {comments}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={tailwind`flex-col justify-center items-center`}>
          <Icon name="share-2" size={30} color={iconColor} />
          <Text style={[tailwind`text-sm`, { color: isDarkMode ? '#A1A1AA' : '#6B7280' }]}>
            {shares}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Card;
