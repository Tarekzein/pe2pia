import {Image, Text, View, TouchableOpacity, FlatList, RefreshControl} from 'react-native';
import tailwind from 'twrnc';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useProfile } from '../../context/ProfileContext';
import Modal from 'react-native-modal';
import {useFocusEffect} from '@react-navigation/native';

interface InformationCardProps {
  isDarkMode: boolean;
  user: any;
}

interface UserItemProps {
  user: any;
  isDarkMode: boolean;
  onFollow?: () => void;
}

const UserItem: React.FC<UserItemProps> = ({ user, isDarkMode }) => (
  <View style={[
    tailwind`flex-row items-center justify-between p-4`,
    isDarkMode ? tailwind`border-gray-800` : tailwind`border-gray-100`,
    tailwind`border-b`,
  ]}>
    <View style={tailwind`flex-row items-center flex-1`}>
      <Image
        source={{ uri: user.profilePicture?.url }}
        style={[
          tailwind`w-12 h-12 rounded-full`,
          isDarkMode ? tailwind`bg-gray-700` : tailwind`bg-gray-200`
        ]}
      />
      <View style={tailwind`ml-3 flex-1`}>
        <Text
          style={[
            tailwind`font-bold`,
            isDarkMode ? tailwind`text-white` : tailwind`text-gray-900`
          ]}
          numberOfLines={1}
        >
          {user.FirstName} {user.LastName}
        </Text>
        {user.bio && (
          <Text
            style={[
              tailwind`text-sm`,
              isDarkMode ? tailwind`text-gray-400` : tailwind`text-gray-600`
            ]}
            numberOfLines={1}
          >
            {user.bio}
          </Text>
        )}
      </View>
    </View>
  </View>
);

const InformationCard: React.FC<InformationCardProps> = ({ isDarkMode, user }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');
  const { fetchUserFollowers, fetchUserFollowing,userFollowing,userFollowers } = useProfile();

  useEffect(() => {

  }, [user._id]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if (user._id) {
          try {
            console.log('Fetching user data...'); // Debug log
            await Promise.all([
              fetchUserFollowers(user._id),
              fetchUserFollowing(user._id)
            ]);
            console.log('Followers:', userFollowers); // Debug log
            console.log('Following:', userFollowing); // Debug log
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      };

      fetchData();
    }, [])
  );


  const renderUserList = () => {
    const data = activeTab === 'following' ? userFollowing : userFollowers;
    console.log('Rendering list with data:', data); // Debug log

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <UserItem
            user={item}
            isDarkMode={isDarkMode}
          />
        )}
        ListEmptyComponent={
          <Text style={[
            tailwind`text-center py-8`,
            isDarkMode ? tailwind`text-gray-400` : tailwind`text-gray-600`
          ]}>
            No {activeTab} yet
          </Text>
        }
        contentContainerStyle={tailwind`pb-4`}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              if (activeTab === 'following') {
                fetchUserFollowing(user._id);
              } else {
                fetchUserFollowers(user._id);
              }
            }}
            colors={[isDarkMode ? '#FEA928' : '#00347D']}
          />
        }
      />
    );
  };

  // @ts-ignore
  return (
    <View>
      <View style={tailwind`flex-col items-center`}>
        <View style={tailwind`mt-5`}>
          <Image
            source={{ uri: user.profilePicture?.url }}
            style={[
              tailwind`w-30 h-30 rounded-full`,
              isDarkMode ? tailwind`bg-gray-600` : tailwind`bg-gray-200`
            ]}
          />
        </View>
        <Text style={[
          tailwind`text-xl font-bold mt-5`,
          isDarkMode ? tailwind`text-white` : tailwind`text-[#00347D]`
        ]}>
          {user.FirstName} {user.LastName}
        </Text>
        <View style={tailwind`flex-row items-center mt-2`}>
          <Icon name="map-pin" size={17} color="#FEA928" />
          <Text style={[
            tailwind`text-[#00347D] ml-1 font-bold text-lg`,
            isDarkMode ? tailwind`text-white` : tailwind`text-[#00347D]`
          ]}>
            {user.bio}
          </Text>
        </View>
      </View>

      <View style={tailwind`flex-row items-center justify-evenly mt-5`}>
        <TouchableOpacity
          style={tailwind`flex-col items-center justify-center`}
          onPress={() => {
            setActiveTab('following');
            setModalVisible(true);
          }}
        >
          <Text style={tailwind`text-[#FEA928] ml-2 font-bold text-xl`}>
            {user.following?.length}
          </Text>
          <Text style={[
            tailwind`text-[#00347D] ml-2 text-xl`,
            isDarkMode ? tailwind`text-white` : tailwind`text-[#00347D]`
          ]}>
            Following
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tailwind`flex-col items-center justify-center`}
          onPress={() => {
            setActiveTab('followers');
            setModalVisible(true);
          }}
        >
          <Text style={tailwind`text-[#FEA928] ml-2 font-bold text-xl`}>
            {user.followers?.length}
          </Text>
          <Text style={[
            tailwind`text-[#00347D] ml-2 text-xl`,
            isDarkMode ? tailwind`text-white` : tailwind`text-[#00347D]`
          ]}>
            Followers
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={300}
        animationOutTiming={300}
        useNativeDriverForBackdrop={true}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        propagateSwipe={true}
        style={tailwind`m-0 justify-end`}
      >
        <View style={[
          tailwind`rounded-t-3xl flex-1`,
          isDarkMode ? tailwind`bg-gray-900` : tailwind`bg-white`,
          { maxHeight: '80%' } // Add this to limit modal height
        ]}>
          {/* Drag Indicator */}
          <View style={tailwind`items-center pt-2 pb-4`}>
            <View style={[
              tailwind`w-10 h-1 rounded-full`,
              isDarkMode ? tailwind`bg-gray-700` : tailwind`bg-gray-300`
            ]} />
          </View>

          {/* Header */}
          <View style={[
            tailwind`px-4 pb-4 border-b`,
            isDarkMode ? tailwind`border-gray-800` : tailwind`border-gray-200`
          ]}>
            <View style={tailwind`flex-row justify-between items-center`}>
              <Text style={[
                tailwind`text-xl font-bold`,
                isDarkMode ? tailwind`text-white` : tailwind`text-gray-900`
              ]}>
                {activeTab === 'following' ? 'Following' : 'Followers'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[
                  tailwind`p-2 rounded-full`,
                  isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-gray-100`
                ]}
              >
                <Icon name="x" size={20} color={isDarkMode ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={tailwind`flex-row mt-4`}>
              <TouchableOpacity
                style={[
                  tailwind`flex-1 py-2 px-4 rounded-full mr-2`,
                  activeTab === 'following'
                    ? tailwind`bg-[#FEA928]`
                    : isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-gray-100`
                ]}
                onPress={() => setActiveTab('following')}
              >
                <Text style={[
                  tailwind`text-center font-bold`,
                  activeTab === 'following'
                    ? tailwind`text-white`
                    : isDarkMode ? tailwind`text-gray-300` : tailwind`text-gray-600`
                ]}>
                  Following ({userFollowing?.length || 0})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  tailwind`flex-1 py-2 px-4 rounded-full`,
                  activeTab === 'followers'
                    ? tailwind`bg-[#FEA928]`
                    : isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-gray-100`
                ]}
                onPress={() => setActiveTab('followers')}
              >
                <Text style={[
                  tailwind`text-center font-bold`,
                  activeTab === 'followers'
                    ? tailwind`text-white`
                    : isDarkMode ? tailwind`text-gray-300` : tailwind`text-gray-600`
                ]}>
                  Followers ({userFollowers?.length || 0})
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* List Container */}
          <View style={tailwind`flex-1`}>
            {renderUserList()}

          </View>
        </View>
      </Modal>

    </View>
  );
};

export default InformationCard;
