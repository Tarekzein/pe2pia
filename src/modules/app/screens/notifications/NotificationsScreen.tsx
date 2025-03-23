import React, { useEffect, useState, useMemo } from 'react';
import {View, ScrollView, Text, TouchableOpacity, RefreshControl} from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import NotificationCard from '../../components/notifications/NotificationCard.tsx';
import { useTheme } from '../../../../context/ThemeContext.tsx';
import { useNotifications } from '../../context/NotificationsContext.tsx';
import {
  formatDistanceToNow,
  parseISO,
  differenceInMinutes,
  isToday,
  isYesterday,
  format
} from 'date-fns';

interface FormattedNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  date: string;
  avatar: string;
  createdAt: Date;
}

interface NotificationGroup {
  title: string;
  notifications: FormattedNotification[];
}

const NotificationsScreen: React.FC<{navigation: any}> = ({ navigation }) => {
  const { theme } = useTheme();
  const { loading, error, fetchNotifications, notifications } = useNotifications();
  const isDarkMode = theme === 'dark';

  const [formattedNotifications, setFormattedNotifications] = useState<FormattedNotification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Transform and group notifications
  const groupedNotifications = useMemo(() => {
    // Transform notifications
    const transformed = notifications.map(notification => {
      const createdAt = parseISO(notification.createdAt);

      let title = '';
      let type = 'info';
      let avatar = notification.userId?.profilePicture?.url || 'https://i.pravatar.cc/300';

      switch (notification.type) {
        case 'like':
          title = `${notification.userId?.FirstName} ${notification.userId?.LastName}`;
          type = 'like';
          break;
        case 'comment':
          title = `${notification.userId?.FirstName} ${notification.userId?.LastName}`;
          type = 'info';
          break;
        case 'post_accepted':
          title = 'Post Accepted';
          type = 'success';
          break;
        case 'chat':
          title = `${notification.userId?.FirstName} ${notification.userId?.LastName}`;
          type = 'chat';
          break;
        default:
          title = 'Notification';
      }

      return {
        id: notification._id,
        title: title,
        message: notification.message,
        type: type,
        date: formatDistanceToNow(createdAt, { addSuffix: true }),
        avatar: avatar,
        createdAt: createdAt
      };
    });

    // Sort notifications by most recent first
    const sorted = transformed.sort((a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime()
    );

    // Group notifications dynamically
    const groups: NotificationGroup[] = [];
    const now = new Date();

    // Group logic
    const addGroup = (groupTitle: string, filterFn: (notification: FormattedNotification) => boolean) => {
      const groupNotifications = sorted.filter(filterFn);
      if (groupNotifications.length > 0) {
        groups.push({
          title: groupTitle,
          notifications: groupNotifications
        });
      }
    };

    // Dynamic grouping
    addGroup('Just Now', n => differenceInMinutes(now, n.createdAt) < 30);
    addGroup('Today', n => isToday(n.createdAt) && differenceInMinutes(now, n.createdAt) >= 30);
    addGroup('Yesterday', n => isYesterday(n.createdAt));
    addGroup('This Week', n => {
      const daysDifference = differenceInMinutes(now, n.createdAt) / (24 * 60);
      return daysDifference >= 1 && daysDifference < 7;
    });
    addGroup('Older', n => {
      const daysDifference = differenceInMinutes(now, n.createdAt) / (24 * 60);
      return daysDifference >= 7;
    });

    return groups;
  }, [notifications]);

  return (
    <View style={[
      tailwind`flex-1 pb-25`,
      isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-[#FFF8EC] pb-25`
    ]}>
      <View style={tailwind`top-0 left-0 mt-5 ml-5`}>
        <Icon
          name={'arrow-left'}
          size={30}
          style={isDarkMode ? tailwind`text-gray-300` : tailwind`text-[#00347D]`}
          onPress={() => navigation.goBack()}
        />
      </View>

      <View style={tailwind`mt-5`}>
        <View
          style={[
            tailwind`flex-row justify-between items-center bg-[#00347D29] p-4`,
            isDarkMode ? tailwind`bg-gray-700` : tailwind`bg-[#00347D29]`,
          ]}
        >
          <TouchableOpacity>
            <Text
              style={[
                tailwind`font-bold text-lg`,
                isDarkMode ? tailwind`text-gray-300` : tailwind`text-[#00347D]`,
              ]}
            >
              Unread
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text
              style={[
                tailwind`font-bold text-lg`,
                isDarkMode ? tailwind`text-gray-300` : tailwind`text-[#00347D]`,
              ]}
            >
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={tailwind`my-4 p-2`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchNotifications}
              tintColor={isDarkMode ? '#FEA928' : '#00347D'}
            />
          }
        >
          {groupedNotifications.map((group, index) => (
            <View key={index}>
              <Text style={tailwind`font-bold text-[#FEA928] text-3xl mt-4`}>
                {group.title}
              </Text>
              {group.notifications.map(notification => (
                <NotificationCard
                  key={notification.id}
                  isDarkMode={isDarkMode}
                  notification={notification}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default NotificationsScreen;
