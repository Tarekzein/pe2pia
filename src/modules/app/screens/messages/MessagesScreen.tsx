import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  AppState,
  AppStateStatus, RefreshControl,
} from 'react-native';
import tailwind from 'twrnc';
import ChatCard from '../../components/messages/ChatCard.tsx';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../../context/ThemeContext';
import { useAuth } from '../../../../context/AuthContext.tsx';
import { useMessages } from "../../context/MessagesContext.tsx";

import UserAvatar from '../../components/messages/UserAvatar.tsx';
import {useFocusEffect} from '@react-navigation/native';
import ConfirmationModal from './../../components/messages/ConfirmationModal.tsx';

const tabs = ['All chats', 'Groups', 'Requests'];
const screenWidth = Dimensions.get('window').width;
const FETCH_INTERVAL = 1000; // 3 seconds

interface MessagesScreenProps {
  navigation: any;
}

const MessagesScreen: React.FC<MessagesScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('All chats');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const currentTabIndex = tabs.indexOf(activeTab);
  const { theme } = useTheme();
  const { user } = useAuth();
  const { fetchChats, chats,fetchFollowing,following,createConversation,newConversation } = useMessages();
  const isDarkMode = theme === 'dark';
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const fetchFollowingUsers = async () => {
        try {
          fetchFollowing(user.id);
        } catch (err: any) {
          console.error(err);
        }
      };

      fetchFollowingUsers();
    }, [])
  );

  // Start periodic chat fetching
  const startPeriodicFetching = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval
    intervalRef.current = setInterval(() => {
      fetchChats(user.id);
    }, FETCH_INTERVAL);
  }, []);

  // Handle app state changes
  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App has come to the foreground
      fetchChats(user.id);
      startPeriodicFetching();
    } else if (
      appState.current === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      // App has gone to the background
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    appState.current = nextAppState;
  }, [ startPeriodicFetching]);

  // Initial setup and cleanup
  useEffect(() => {
    // Fetch initial chats
    fetchChats(user.id);

    // Start periodic fetching
    startPeriodicFetching();

    // Add app state listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup
    return () => {
      // Remove interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Remove app state listener
      subscription.remove();
    };
  }, [startPeriodicFetching, handleAppStateChange]);

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
      setActiveTab(tab);
      translateX.setValue(-direction * screenWidth);

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

  const handleUserPress = (user: any) => {
    setSelectedUser(user);
    setIsConfirmModalVisible(true);
  };

  const handleStartConversation = async () => {
    if (!selectedUser) return;

    try {
      // Check if conversation already exists
      const existingChat = chats.find(chat =>
        chat.members.some((member: {id: any}) => member.id === selectedUser.id),
      );

      if (!existingChat) {
        navigation.navigate('Chat', { chat: existingChat, user });
      } else {
        // Create new conversation
        const newChat = {
          senderId: user.id,
          receiverId: selectedUser.id,
        };

        // Add your logic to create chat in backend
        await createConversation(newChat);
        if (newConversation) {
          navigation.navigate('Chat', { chat: newConversation, user });
        }
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsConfirmModalVisible(false);
      setSelectedUser(null);
    }
  };

  return (
    <View style={[tailwind`flex-1`, isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-[#FFF8EC]`]}>
      {/* Header */}
      <View style={tailwind`flex-row justify-between items-center mt-5 mx-5`}>
        <Icon
          name="arrow-left"
          size={30}
          style={isDarkMode ? tailwind`text-white` : tailwind`text-[#00347D]`}
          onPress={() => navigation.goBack()}
        />
        {/*<View style={tailwind`flex-row items-center`}>*/}
        {/*  <Icon name="edit" style={tailwind`mr-7`} size={25} color="#FEA928" />*/}
        {/*  <Icon name="search" size={25} color="#FEA928" />*/}
        {/*</View>*/}
      </View>

      {/* Tabs */}
      <View style={tailwind`flex-row justify-between items-center w-fit mx-4 mt-5 rounded-full bg-[#D6D9DA]`}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              tailwind`px-4 py-2 rounded-full`,
              activeTab === tab && (isDarkMode ? tailwind`bg-gray-700` : tailwind`bg-[#00347D]`),
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

      {/* Horizontal scroll of online users */}
      <View style={tailwind`mt-4 px-4`}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {following.map((user) => (
            <UserAvatar
              key={user.id}
              user={user}
              isDarkMode={isDarkMode}
              onPress={() => handleUserPress(user)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Animated Chat List */}
      <Animated.View
        style={[
          tailwind`flex-1 mt-5`,
          { opacity: fadeAnim, transform: [{ translateX }] },
        ]}
      >
        <ScrollView
          style={tailwind`px-4`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tailwind`pb-20`}
          onScrollBeginDrag={() => {
            Animated.timing(fadeAnim, {
              toValue: 0.5,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }}
          onScrollEndDrag={() => {
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }}
          scrollEventThrottle={16}
          onScroll={() => {
            Animated.timing(translateX, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              colors={['#FEA928']}
              onRefresh={() => {
                fetchChats(user.id);
              }}
            />
          }
        >
          {chats.map((chat, index) => (
            <ChatCard
              key={index}
              user={
                chat.members.find((member: { id: string }) => member.id !== user.id) ?? {}
              }
              message={chat.lastMessage?.text ?? ''}
              time={chat.time ?? ''}
              isTyping={chat.isTyping ?? false}
              unreadCount={chat.unreadCount ?? 0}
              isDarkMode={isDarkMode}
              onPress={() => navigation.navigate('Chat', { chat: chat, user: user })}
            />
          ))}
        </ScrollView>
      </Animated.View>

      <ConfirmationModal
        isVisible={isConfirmModalVisible}
        onClose={() => {
          setIsConfirmModalVisible(false);
          setSelectedUser(null);
        }}
        onConfirm={handleStartConversation}
        user={selectedUser}
        isDarkMode={isDarkMode}
      />

    </View>
  );
};

export default MessagesScreen;
