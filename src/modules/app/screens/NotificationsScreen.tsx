import React, {useState} from 'react';
import { View,ScrollView,Text,TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather'; // Using Feather Icons
import NotificationCard from '../components/notifications/NotificationCard';
interface HomeScreenProps {
  navigation: any;
}

const NotificationsScreen: React.FC<HomeScreenProps>  = ({navigation}) => {

  const [notifications, setNotifications] = useState([
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
    <View style={tailwind`bg-[#FFF8EC] pb-25`}>
      <View style={tailwind` top-0 left-0 mt-5 ml-5`}>
        <Icon name={'arrow-left'} size={30} color={'#00347D'} onPress={() => navigation.goBack()} />
      </View>
      {/* Button container */}
        <View style={tailwind`mt-5`}>
          <View style={tailwind`flex-row justify-between items-center bg-[#00347D29] p-4`}>
            <TouchableOpacity >
              <Text style={tailwind` font-bold text-[#00347D] dark:text-gray-300 text-lg`}>Unread</Text>
            </TouchableOpacity>

            <TouchableOpacity >
              <Text style={tailwind` font-bold text-[#00347D] dark:text-gray-300 text-lg`}>Mark all as read</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={tailwind`mt-3 p-2`}>
            <Text style={tailwind`font-bold text-[#FEA928] dark:text-gray-300 text-3xl`}>Recent</Text>

            {notifications.map((notification, index) => (
              <NotificationCard key={index} notification={notification} />
            ))}

            <Text style={tailwind`font-bold text-[#FEA928] dark:text-gray-300 text-3xl`}>Today</Text>

            {notifications.map((notification, index) => (
              <NotificationCard key={index} notification={notification} />
            ))}

            <Text style={tailwind`font-bold text-[#FEA928] dark:text-gray-300 text-3xl`}>Yesterday</Text>

            {notifications.map((notification, index) => (
              <NotificationCard key={index} notification={notification} />
            ))}
          </ScrollView>
        </View>
    </View>
  );
}

export default NotificationsScreen;
