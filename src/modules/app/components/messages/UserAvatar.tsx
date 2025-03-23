import {
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import tailwind from 'twrnc';
import React from 'react';


interface User {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  isOnline: boolean;
}

// A simple component for user avatars in the horizontal scroll
const UserAvatar: React.FC<{ user: User; isDarkMode: boolean; onPress: () => void }> = ({ user, isDarkMode, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={tailwind`mr-4 items-center`}>
      <View style={tailwind`relative`}>
        <Image
          source={{ uri: user.profilePicture || 'https://i.pravatar.cc/300' }}
          style={[
            tailwind`w-16 h-16 rounded-full`,
            { borderWidth: 2, borderColor: isDarkMode ? '#FEA928' : '#00347D' }
          ]}
        />
        {user.isOnline && (
          <View
            style={[
              tailwind`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2`,
              { backgroundColor: '#4CAF50', borderColor: isDarkMode ? '#374151' : '#FFF8EC' }
            ]}
          />
        )}
      </View>
      <Text
        style={[
          tailwind`text-sm mt-1`,
          isDarkMode ? tailwind`text-gray-200` : tailwind`text-gray-800`
        ]}
      >
        {user.firstName}
      </Text>
    </TouchableOpacity>
  );
};

export default UserAvatar;
