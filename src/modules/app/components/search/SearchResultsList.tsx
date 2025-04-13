import React, { useState } from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import tailwind from 'twrnc';
import { useTheme } from '../../../../context/ThemeContext.tsx';
import { useSearch } from '../../context/SearchContext.tsx';

const SearchResultsList: React.FC = () => {
    const { searchResults } = useSearch();
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    // State for active tab
    const [activeTab, setActiveTab] = useState('All');

    // Tabs for filtering
    const tabs = ['All', 'People', 'Groups', 'Post', 'Media'];

    // Filtered data based on active tab
    const filteredResults = searchResults.filter((item: any) => {
        if (activeTab === 'All') return true;
        return item.type === activeTab.toLowerCase(); // Ensure item.type matches tab name
    });

  const RenderSearchPeople = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        tailwind`p-3 mx-2 my-1 rounded-xl flex-row items-center`,
        isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-white`,
        {
          shadowColor: isDarkMode ? '#000' : '#666',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        }
      ]}
    >
      {/* Profile Picture Section */}
      <View style={tailwind`mr-3`}>
        {item.profilePicture?.url ? (
          <Image
            source={{ uri: item.profilePicture?.url }}
            style={[
              tailwind`w-14 h-14 rounded-full`,
              {
                borderWidth: 2,
                borderColor: isDarkMode ? '#3b82f6' : '#1877f2'
              }
            ]}
          />
        ) : (
          <View
            style={[
              tailwind`w-14 h-14 rounded-full bg-gray-200 items-center justify-center`,
              isDarkMode && tailwind`bg-gray-700`
            ]}
          >
            <Icon name="user" size={24} color={isDarkMode ? '#fff' : '#666'} />
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={tailwind`flex-1`}>
        <View style={tailwind`flex-row items-center justify-between`}>
          <View style={tailwind`flex-1`}>
            <Text
              style={[
                tailwind`text-base font-semibold`,
                isDarkMode ? tailwind`text-white` : tailwind`text-gray-900`
              ]}
              numberOfLines={1}
            >
              {item.FirstName} {item.LastName || ''}
            </Text>

            {item.bio && (
              <Text
                style={[
                  tailwind`text-sm mt-0.5`,
                  isDarkMode ? tailwind`text-gray-400` : tailwind`text-gray-500`
                ]}
                numberOfLines={2}
              >
                {item.bio}
              </Text>
            )}
          </View>

          {/* Follow Button */}
          <TouchableOpacity
            style={[
              tailwind`px-4 py-2 rounded-full ml-2`,
              isDarkMode ?
                tailwind`bg-gray-700` :
                tailwind`bg-blue-50`
            ]}
            onPress={() => console.log('Follow action triggered')}
          >
            <Text
              style={[
                tailwind`font-medium`,
                isDarkMode ?
                  tailwind`text-blue-400` :
                  tailwind`text-blue-600`
              ]}
            >
              Follow
            </Text>
          </TouchableOpacity>
        </View>

        {/* Optional: Add mutual friends or other info */}
        {item.mutualFriends && (
          <Text
            style={[
              tailwind`text-xs mt-1`,
              isDarkMode ? tailwind`text-gray-500` : tailwind`text-gray-400`
            ]}
          >
            {item.mutualFriends} mutual friends
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

    const RenderSearchGroups = ({ item }: { item: any }) => (
        <View
            style={[
                tailwind`p-4 m-2 rounded-lg flex-row items-start justify-between`,
                isDarkMode ? tailwind`bg-gray-700` : tailwind`bg-white`,
            ]}
        >
            <View style={tailwind`flex-row items-start`}>
                <Image source={{ uri: item.coverPhoto?.url }} style={tailwind`w-9 h-9 mr-2 rounded-full`} />
                <View style={tailwind``}>
                    <Text style={[tailwind`text-lg font-bold`,isDarkMode ? tailwind`text-white` : tailwind`text-black`]}>
                        {item.name}
                    </Text>
                    <Text style={isDarkMode ? tailwind`text-gray-400` : tailwind`text-gray-600`}>
                        {item.description}
                    </Text>
                </View>
            </View>
        </View>
    );

    const RenderSearchPost = ({ item }: { item: any }) => (
        <View
            style={[
                tailwind`p-4 m-2 rounded-lg flex-row items-start justify-between`,
                isDarkMode ? tailwind`bg-gray-700` : tailwind`bg-white`,
            ]}
        >
            <View style={tailwind`flex-row items-start`}>
                {/*<Image source={{ uri: item.author.profilePicture?.url }} style={tailwind`w-9 h-9 mr-2 rounded-full`} />*/}
                <View style={tailwind``}>
                    {/*<Text style={[tailwind`text-lg font-bold`,isDarkMode ? tailwind`text-white` : tailwind`text-black`]}>*/}
                    {/*    {item.author.FirstName} {item.author.LastName || ''}*/}
                    {/*</Text>*/}
                    <Text style={isDarkMode ? tailwind`text-gray-400` : tailwind`text-gray-600`}>
                        {item.description}
                    </Text>
                </View>
            </View>
        </View>
    );

    const RenderSearchMedia = ({ item }: { item: any }) => (
        <View
            style={[
                tailwind`p-4 m-2 rounded-lg flex-row items-start justify-between`,
                isDarkMode ? tailwind`bg-gray-700` : tailwind`bg-white`,
            ]}
        >
            <View style={tailwind`flex-row items-start`}>
                <Image source={{ uri: item.url }} style={tailwind`w-9 h-9 mr-2 rounded-full`} />
                <View style={tailwind``}>
                    <Text style={[tailwind`text-lg font-bold`,isDarkMode ? tailwind`text-white` : tailwind`text-black`]}>
                        {item.name}
                    </Text>
                    <Text style={isDarkMode ? tailwind`text-gray-400` : tailwind`text-gray-600`}>
                        {item.description}
                    </Text>
                </View>
            </View>
        </View>
    );


    // Render individual item
    const renderSearchResult = ({ item }: { item: any }) => {
        switch (item.type) {
            case 'people':
                return <RenderSearchPeople item={item}/>;
            case 'groups':
                return <RenderSearchGroups item={item}/>;
            case 'post':
                return <RenderSearchPost item={item}/>;
            case 'media':
                return <RenderSearchMedia item={item}/>;
            default:
                return <Text>Invalid type</Text>;
        }
    };

    // Render tabs
    const renderTab = (tab: string) => (
        <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
                tailwind`px-4 py-2 rounded-full`,
                activeTab === tab
                    ? tailwind`bg-[#00347D]`
                    : isDarkMode
                        ? tailwind`bg-gray-700`
                        : tailwind`bg-gray-200`,
            ]}
        >
            <Text
                style={[
                    tailwind`text-sm font-medium`,
                    activeTab === tab
                        ? tailwind`text-white`
                        : isDarkMode
                            ? tailwind`text-gray-400`
                            : tailwind`text-black`,
                ]}
            >
                {tab}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={tailwind`flex-1`}>
            {/* Tabs */}
            <View style={tailwind`flex-row justify-between py-4`}>
                {tabs.map((tab) => renderTab(tab))}
            </View>

            {/* List */}
            <FlatList
                data={filteredResults}
                keyExtractor={(item) => item.id?.toString()}
                renderItem={renderSearchResult}
                showsVerticalScrollIndicator={false}
                style={isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-[#FFF8EC]`}
                ListEmptyComponent={
                    <Text
                        style={[
                            tailwind`text-center mt-4`,
                            isDarkMode ? tailwind`text-white` : tailwind`text-gray-600`,
                        ]}
                    >
                        No results found.
                    </Text>
                }
            />
        </View>
    );
};

export default SearchResultsList;
