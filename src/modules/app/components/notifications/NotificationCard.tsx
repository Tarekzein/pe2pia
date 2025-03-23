import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import tailwind from 'twrnc';

interface NotificationCardProps {
  notification: {
    title: string;
    message: string;
    type: string;
    date: string;
    avatar: string;
  },
  isDarkMode?: boolean,
  onPress?: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
                                                             notification,
                                                             isDarkMode,
                                                             onPress
                                                           }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'check-circle-outline';
      case 'error':
        return 'alert-circle-outline';
      case 'info':
        return 'information-outline';
      case 'like':
        return 'heart-outline';
      case 'share':
        return 'share-variant';
      case 'chat':
        return 'chat-outline';
      default:
        return 'bell-outline';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'like':
        return '#E91E63';
      case 'info':
        return '#2196F3';
      case 'chat':
        return '#FFC107';
      default:
        return '#FEA928';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={
          isDarkMode
            ? ['rgba(55, 65, 81, 0.5)', 'rgba(55, 65, 81, 0.3)']
            : ['rgba(254, 203, 125, 0.16)', 'rgba(254, 203, 125, 0.08)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          tailwind`mx-4 my-2 rounded-xl overflow-hidden`,
          {
            shadowColor: isDarkMode ? '#ffffff20' : '#00000020',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }
        ]}
      >
        <View
          style={[
            tailwind`flex-row items-center p-4`,
            isDarkMode
              ? tailwind`bg-gray-800/50`
              : tailwind`bg-transparent`
          ]}
        >
          {/* Avatar Container */}
          <View style={tailwind`relative mr-4`}>
            <Image
              source={{ uri: notification.avatar }}
              style={[
                tailwind`w-14 h-14 rounded-full`,
                {
                  borderWidth: 2,
                  borderColor: isDarkMode ? '#FEA92850' : '#00347D20'
                }
              ]}
            />
            {/* Notification Type Icon */}
            <View
              style={[
                tailwind`absolute -bottom-1 -right-1 p-1 rounded-full`,
                {
                  backgroundColor: getIconColor(notification.type),
                  borderWidth: 2,
                  borderColor: isDarkMode ? '#374151' : '#FFF8EC'
                }
              ]}
            >
              <MaterialCommunityIcons
                name={getIcon(notification.type)}
                size={16}
                color="white"
              />
            </View>
          </View>

          {/* Notification Content */}
          <View style={tailwind`flex-1`}>
            <Text
              style={[
                tailwind`text-base font-bold`,
                isDarkMode
                  ? tailwind`text-gray-100`
                  : tailwind`text-[#00347D]`
              ]}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            <Text
              style={[
                tailwind`text-sm mt-1`,
                isDarkMode
                  ? tailwind`text-gray-300`
                  : tailwind`text-[#00347D80]`
              ]}
              numberOfLines={2}
            >
              {notification.message}
            </Text>
            <Text
              style={[
                tailwind`text-xs mt-1 text-right`,
                isDarkMode
                  ? tailwind`text-gray-400`
                  : tailwind`text-[#00347D60]`
              ]}
            >
              {notification.date}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default NotificationCard;
