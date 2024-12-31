import React, {useState, useRef, useEffect} from 'react';
import { View, ScrollView, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import tailwind from 'twrnc';
import ChatCard from '../../components/messages/ChatCard.tsx'; // Assuming the ChatCard component is separate
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '../../../../context/ThemeContext';
import {useAuth} from '../../../../context/AuthContext.tsx';
import {useMessages} from "../../context/MessagesContext.tsx";

const tabs = ['All chats', 'Groups', 'Requests'];
const screenWidth = Dimensions.get('window').width;

interface MessagesScreenProps {
  navigation: any;
}

const MessagesScreen: React.FC<MessagesScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('All chats');
  const fadeAnim = useRef(new Animated.Value(1)).current; // For fading effect
  const translateX = useRef(new Animated.Value(0)).current; // For sliding effect
  const currentTabIndex = tabs.indexOf(activeTab);
  const { theme } = useTheme();
  const { user } = useAuth();
  const {fetchChats,chats} = useMessages();
  const isDarkMode = theme === 'dark';
  useEffect(() => {
    fetchChats(user.id);
  }, []);

  const handleTabChange = (tab: string) => {
    const newTabIndex = tabs.indexOf(tab);
    const direction = newTabIndex > currentTabIndex ? 1 : -1;

    // Animate both fade and slide
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: direction * screenWidth,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveTab(tab); // Update the active tab
      translateX.setValue(-direction * screenWidth); // Reset position for new content

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  return (
    <View style={[tailwind`flex-1 `,isDarkMode? tailwind`bg-gray-800`:tailwind`bg-[#FFF8EC]`]}>
      {/* Header */}
      <View style={tailwind`flex-row justify-between items-center mt-5 mx-5`}>
        <Icon name="arrow-left" size={30}  style={
          isDarkMode? tailwind`text-white`:tailwind`text-[#00347D]`
        } onPress={() => navigation.goBack()} />
        <View style={tailwind`flex-row items-center`}>
          <Icon name="edit" style={tailwind`mr-7`} size={25} color="#FEA928" />
          <Icon name="search" size={25} color="#FEA928" />
        </View>
      </View>

      {/* Tabs */}
      <View style={tailwind`flex-row justify-between items-center w-fit mx-4 mt-5 rounded-full bg-[#D6D9DA]`}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              tailwind`px-4 py-2 rounded-full`,
              activeTab === tab && (isDarkMode? tailwind`bg-gray-700` : tailwind`bg-[#00347D]`),
            ]}
            onPress={() => handleTabChange(tab)}
          >
            <Text
              style={[
                tailwind`text-lg text-[#00347D]`,
                activeTab === tab && tailwind`text-[#D6D9DA] font-medium`,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Animated Chat List */}
      <Animated.View
        style={[
          tailwind`flex-1 mt-5`,
          { opacity: fadeAnim, transform: [{ translateX }] },
        ]}
      >
        <ScrollView>
          {chats.map((chat, index) => (
            <ChatCard
              key={index}
              title={chat.title??''}
              message={chat.message??''}
              time={chat.time??''}
              isTyping={chat.isTyping??false}
              unreadCount={chat.unreadCount??0}
              isDarkMode={isDarkMode}
              onPress={() => navigation.navigate('Chat', { title: chat.title??'' })}
            />
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default MessagesScreen;
