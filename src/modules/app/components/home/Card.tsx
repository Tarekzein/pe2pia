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
    <View style={tailwind`mb-4 bg-[#FFF8EC] rounded-xl p-4`}>
      {/* User Info */}

      <View style={tailwind`flex-row justify-between items-center`}>
        <View style={tailwind`flex-row `}>
          <View
            style={tailwind`w-10 mr-2 h-10 bg-gray-300 rounded-full`}
          />
          <View>
            <Text style={tailwind`text-lg font-bold text-[#00347D]`}>
              {username}
            </Text>
            <Text style={tailwind`text-sm text-[#FFB300]`}>{category}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text style={tailwind`text-gray-400 text-xl`}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {contentType === 'image' ? (
        <View style={tailwind`mt-4 bg-gray-200 rounded-lg h-60`}>
          {/* Replace with Image component when using real images */}
          <Text style={tailwind`text-center text-gray-500`}>Image Placeholder</Text>
        </View>
      ) : (
        <Text style={tailwind`mt-4 text-sm text-gray-800`}>{content}</Text>
      )}

      {/* Action Buttons */}
      <View style={tailwind`flex-row justify-between items-center mt-4 px-5`}>
        <TouchableOpacity style={tailwind`flex-col justify-center items-center`}>
          <Icon name={'heart' } size={30} color={'#FFB300'} />
          <Text style={tailwind` text-sm text-gray-600`}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tailwind`flex-col justify-center items-center`}>
          <Icon name={'message-circle'} size={30} color={'#FFB300'} />
          <Text style={tailwind`text-sm text-gray-600`}>{comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tailwind`flex-col justify-center items-center`}>
          <Icon name={'share-2'} size={30} color={'#FFB300'} />
          <Text style={tailwind` text-sm text-gray-600`}>{shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Card;
