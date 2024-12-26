import React, {useState} from 'react';
import { View,ScrollView,Text,TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather'; // Using Feather Icons
import NotificationCard from '../../components/notifications/NotificationCard.tsx';
import { useTheme } from '../../../../context/ThemeContext.tsx';
import { useNotifications } from '../../context/NotificationsContext.tsx';
interface HomeScreenProps {
  navigation: any;
}

const NotificationsScreen: React.FC<HomeScreenProps>  = ({navigation}) => {
  const { theme } = useTheme();
  const { loading, error, fetchNotifications } = useNotifications();
  const isDarkMode = theme === 'dark';
  const [notifications] = useState([
    {
      id: 1,
      title: 'Success Notification',
      message: 'This is a success notification message',
      type: 'success',
      date: '2h ago',
      avatar: 'https://i.pravatar.cc/300'
    },
    {
      id: 2,
      title: 'Error Notification',
      message: 'This is an error notification message',
      type: 'error',
      date: '3PM',
      avatar: 'https://i.pravatar.cc/300'

    },
    {
      id: 3,
      title: 'Info Notification',
      message: 'This is an info notification message',
      type: 'info',
      date: '3PM',
      avatar: 'https://i.pravatar.cc/300'

    },
  ]);


  return (
    <View style={[tailwind`flex-1 pb-25`,isDarkMode? tailwind`bg-gray-800`:tailwind`bg-[#FFF8EC] pb-25`]}>
      <View style={tailwind` top-0 left-0 mt-5 ml-5`}>
        <Icon name={'arrow-left'} size={30}
              style={isDarkMode? tailwind`text-gray-300`:tailwind`text-[#00347D]`}
              onPress={() => navigation.goBack()} />
      </View>
      {/* Button container */}
        <View style={tailwind`mt-5`}>
          <View style={[tailwind`flex-row justify-between items-center bg-[#00347D29] p-4`,
            isDarkMode? tailwind`bg-gray-700`:tailwind`bg-[#00347D29]`
          ]}>
            <TouchableOpacity >
              <Text style={[tailwind` font-bold  text-lg`,
                isDarkMode? tailwind`text-gray-300`:tailwind`text-[#00347D]`
              ]}>Unread</Text>
            </TouchableOpacity>

            <TouchableOpacity >
              <Text style={[tailwind` font-bold  text-lg`,
                isDarkMode? tailwind`text-gray-300`:tailwind`text-[#00347D]`
              ]}>Mark all as read</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={tailwind`my-4 p-2`}>
            <Text style={tailwind`font-bold text-[#FEA928] text-3xl`}>Recent</Text>

            {notifications.map((notification, index) => (
              <NotificationCard isDarkMode={isDarkMode} key={index} notification={notification} />
            ))}

            <Text style={tailwind`font-bold text-[#FEA928] text-3xl`}>Today</Text>

            {notifications.map((notification, index) => (
              <NotificationCard isDarkMode={isDarkMode} key={index} notification={notification} />
            ))}

            <Text style={tailwind`font-bold text-[#FEA928] text-3xl`}>Yesterday</Text>

            {notifications.map((notification, index) => (
              <NotificationCard isDarkMode={isDarkMode} key={index} notification={notification} />
            ))}
          </ScrollView>
        </View>
    </View>
  );
}

export default NotificationsScreen;
