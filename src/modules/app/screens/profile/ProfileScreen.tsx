import React from 'react';
import { View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import InformationCard from '../../components/profile/InformationCard';
import UserPosts from '../../components/profile/UserPosts';
import { useTheme } from '../../../../context/ThemeContext';
import { useAuth } from '../../../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { loading, fetchUserPosts } = useProfile();
  const isDarkMode = theme === 'dark';

  const handleRefresh = async () => {
    if (user?._id) {
      await fetchUserPosts(user._id);
    }
  };

  return (
    <View style={[
      tailwind`flex-1`,
      isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-[#FFF8EC]`
    ]}>
      {/* Header */}
      <View style={tailwind`flex-row justify-between items-center mt-5 mx-5`}>
        <Icon
          name="arrow-left"
          size={30}
          onPress={() => navigation.goBack()}
          style={isDarkMode ? tailwind`text-white` : tailwind`text-[#00347D]`}
        />
        <TouchableOpacity
          style={tailwind`flex-row items-center`}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="settings" size={25} color="#FEA928" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={[isDarkMode ? '#FEA928' : '#00347D']}
          />
        }
      >
        <InformationCard user={user} isDarkMode={isDarkMode} />
        <UserPosts userID={user._id} user={user} isDarkMode={isDarkMode} />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
