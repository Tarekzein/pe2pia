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
        <View
            style={[
                tailwind`p-4 m-2 rounded-lg flex-row items-start justify-between`,
                isDarkMode ? tailwind`bg-gray-700` : tailwind`bg-white`,
            ]}
        >
            <View style={tailwind`flex-row items-start`}>
                <Image source={{ uri: item.profilePicture?.url }} style={tailwind`w-9 h-9 mr-2 rounded-full`} />
                <View style={tailwind``}>
                    <Text style={[tailwind`text-lg font-bold`,isDarkMode ? tailwind`text-white` : tailwind`text-black`]}>
                        {item.FirstName} {item.LastName || ''}
                    </Text>
                    <Text style={isDarkMode ? tailwind`text-gray-400` : tailwind`text-gray-600`}>
                        {item.bio}
                    </Text>
                </View>


            </View>

            <TouchableOpacity onPress={() => console.log('Follow action triggered')}>
                <Text style={isDarkMode ? tailwind`text-gray-400` : tailwind`text-gray-600`}>
                    Follow
                </Text>
            </TouchableOpacity>

        </View>
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
