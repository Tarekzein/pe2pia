import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';

interface ChatItemProps {
  title: string;
  message: string;
  time: string;
  isTyping?: boolean;
  unreadCount?: number;
  onPress?: () => void;
  isDarkMode?: boolean;
}

const ChatCard: React.FC<ChatItemProps> = ({
                                             title,
                                             message,
                                             time,
                                             isTyping,
                                             unreadCount = 0,
                                             onPress,
                                            isDarkMode}) => {
  return (
    <TouchableOpacity style={[tailwind`flex-row p-4 border-b`,
      isDarkMode? tailwind`border-gray-600`:tailwind`border-gray-200`
    ]} onPress={onPress}>
      {/* Avatar Placeholder */}
      <View style={tailwind`w-10 h-10 rounded-full bg-gray-200`} />

      {/* Content Container */}
      <View style={tailwind`flex-1 ml-3`}>
        {/* Header Row: Title and Time */}
        <View style={tailwind`flex-row justify-between items-center`}>
          <Text style={[tailwind`text-lg font-medium`,
            isDarkMode? tailwind`text-white`:tailwind`text-[#00347D]`
          ]}>{title}</Text>
          <Text style={tailwind`text-sm text-gray-500`}>{time}</Text>
        </View>

        {/* Message Row: Last message and unread count */}
        <View style={tailwind`flex-row justify-between items-center mt-1`}>
          <Text
            style={[
              [tailwind`text-base text-gray-600 flex-1`,
                isDarkMode? tailwind`text-[#eee]`:tailwind`text-text-gray-600`
              ],
              isTyping && tailwind`text-[#FEA928] italic`,
            ]}
            numberOfLines={1}
          >
            {message}
          </Text>

          {/* Unread Messages Badge */}
          {unreadCount > 0 && (
            <View style={tailwind`bg-[#FEA928] rounded-full w-5 h-5 justify-center items-center ml-2`}>
              <Text style={tailwind`text-white text-xs font-medium`}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatCard;
