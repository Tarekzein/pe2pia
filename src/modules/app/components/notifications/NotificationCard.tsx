import React from 'react';
import {Card, Paragraph} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import tailwind from 'twrnc';
import { View, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient

interface NotificationCardProps {
  notification: {
    title: string;
    message: string;
    type: string;
    date: string;
    avatar: string; // URL for the avatar image
  };
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return 'check-circle-outline';
      case 'error':
        return 'alert-circle-outline';
      case 'info':
        return 'information-outline';
      case 'like':
        return 'heart-outline'; // Example for like
      case 'share':
        return 'share-variant'; // Example for share
      default:
        return 'bell-outline';
    }
  };

  return (
    <LinearGradient
      colors={['rgba(254, 169, 40, 0.24)', 'rgba(254, 169, 40, 0.16)']} // Gradient colors
      start={{ x: 0, y: 0 }} // Gradient start point
      end={{ x: 1, y: 0 }} // Gradient end point
      style={tailwind`m-4 rounded-xl`}> {/* Gradient background applied here */}

      <Card.Content style={tailwind`py-3`}>
        <Card.Title
          title={notification.title}
          subtitle={notification.date}
          titleStyle={tailwind`text-[#00347D] dark:text-gray-300`}
          subtitleStyle={tailwind`text-right text-sm dark:text-gray-300`}
          left={() => (
            <View style={tailwind`relative`}>
              {/* Avatar Image */}
              <Image
                source={{ uri: notification.avatar }}
                style={tailwind`w-12 h-12 rounded-full border-2 border-white`} // Avatar styling with Tailwind
              />
              {/* Icon on Avatar */}
              <MaterialCommunityIcons
                name={getIcon(notification.type)}
                size={20}
                color="white"
                style={tailwind`absolute bg-[#00347D] -bottom-3 -right-3 p-1 rounded-full`} // Icon styling with Tailwind
              />
            </View>
          )}
        />
      </Card.Content>
    </LinearGradient>
  );
};

export default NotificationCard;
