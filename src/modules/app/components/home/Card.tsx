import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';

interface CardProps {
  username: string;
  category: string;
  contentType: 'image' | 'text';
  content: string; // Either an image URL or text content
  likes: number;
  comments: number;
  shares: number;
}

const Card: React.FC<CardProps> = ({ username, category, contentType, content, likes, comments, shares }) => {
  return (
    <View style={tailwind`mb-4 bg-[#FFF8EC] dark:bg-gray-800 rounded-xl p-4`}>
      {/* User Info */}
      <View style={tailwind`flex-row justify-between items-center`}>
        <View style={tailwind`flex-row`}>
          <View style={tailwind`w-10 h-10 mr-2 bg-gray-300 dark:bg-gray-700 rounded-full`} />
          <View>
            <Text style={tailwind`text-lg font-bold text-[#00347D] dark:text-gray-200`}>
              {username}
            </Text>
            <Text style={tailwind`text-sm text-[#FFB300] dark:text-yellow-500`}>{category}</Text>
          </View>
        </View>
        <TouchableOpacity>
            <Icon name="more-vertical"  style={tailwind`text-[#FFB300] font-bold dark:text-gray-500 text-3xl`} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {contentType === 'image' ? (
        <View style={tailwind`mt-4 bg-gray-200 dark:bg-gray-700 rounded-lg h-60`}>
          {/* Replace with Image component when using real images */}
          <Text style={tailwind`text-center text-gray-500 dark:text-gray-400`}>
            Image Placeholder
          </Text>
        </View>
      ) : (
        <Text style={tailwind`mt-4 text-sm text-gray-800 dark:text-gray-300`}>{content}</Text>
      )}

      {/* Action Buttons */}
      <View style={tailwind`flex-row justify-between border-t border-gray-300 items-center mt-4 px-5 pt-4`}>
        <TouchableOpacity style={tailwind`flex-col justify-center items-center`}>
          <Icon name="heart" size={30} color="#FFB300" />
          <Text style={tailwind`text-sm text-gray-600 dark:text-gray-400`}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tailwind`flex-col justify-center items-center`}>
          <Icon name="message-circle" size={30} color="#FFB300" />
          <Text style={tailwind`text-sm text-gray-600 dark:text-gray-400`}>{comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tailwind`flex-col justify-center items-center`}>
          <Icon name="share-2" size={30} color="#FFB300" />
          <Text style={tailwind`text-sm text-gray-600 dark:text-gray-400`}>{shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Card;
