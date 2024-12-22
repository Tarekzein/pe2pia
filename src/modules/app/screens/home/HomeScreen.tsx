import React, { useEffect, useState } from 'react';
import {View, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import tailwind from 'twrnc';
import HomeHeader from '../../components/home/HomeHeader.tsx';
import Card from '../../components/home/Card.tsx';
import PostOverlay from '../../components/home/PostOverlay.tsx';
import CommentsOverlay from '../../components/home/CommentsOverlay.tsx';
import { useTheme } from '../../../../context/ThemeContext.tsx';
import { useHome } from '../../context/HomeContext';
import { useAuth } from '../../../../context/AuthContext';
import CardSkeleton from '../../components/home/CardSkeleton';
import Material from 'react-native-vector-icons/MaterialCommunityIcons.js';

interface HomeScreenProps {
    navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
    const { theme } = useTheme();
    const { posts, postsLoading,commentsLoading, fetchPosts,likePost,fetchPostComments,postComments } = useHome();
    const { user } = useAuth();
    const isDarkMode = theme === 'dark';

    const [selectedPost, setSelectedPost] = useState(null);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [commentsOverlayVisible, setCommentsOverlayVisible] = useState(false);
    const [categories] = useState([
        {
            name:'all',
            icon:'format-align-justify',
        },
        {
            name:'cats',
            icon:'cat',
        },
        {
            name:'dogs',
            icon:'dog',
        },
        {
            name:'birds',
            icon:'bird',
        },
        {
            name:'turtles',
            icon:'turtle',
        },
        {
            name:'fishes',
            icon:'fish',
        },
        {
            name:'others',
            icon:'dots-horizontal',
        },
    ]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetchPosts(selectedCategory === 'all' ? '' : selectedCategory);
    },  [selectedCategory]);

    const handlePostClick = (post: any) => {
        setSelectedPost(post);
        setOverlayVisible(true);
    };
    const handleCommentsClick = async (post: any) => {
        try {
            setCommentsOverlayVisible(true);
            fetchPostComments(post._id);
            setSelectedPost(post);
        }catch (e) {
            console.log(e);
        }
    };
    const handleOverlayClose = () => {
        setOverlayVisible(false);
        setCommentsOverlayVisible(false);
        setSelectedPost(null);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <View style={[tailwind`flex-1 `, isDarkMode ? tailwind`bg-gray-900` : '']}>
            <HomeHeader navigation={navigation} />
            {/* Sticky Navigation Bar */}
            <View
                style={[tailwind`flex-row p-4 justify-between items-center shadow-md sticky top-0 z-10`,
                    isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-[#FFF8EC]`,

                ]}
            >
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => `category-${index}`}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item.name}
                            onPress={() => handleCategoryChange(item.name)}
                            style={[
                                tailwind`w-12 h-12 rounded-full border flex justify-center items-center mx-auto`,
                                // Conditional background and border styles
                                isDarkMode
                                    ? tailwind`bg-gray-700 border ${selectedCategory === item.name ? 'border-[#FEA928]' : 'border-gray-700'}`
                                    : tailwind`bg-gray-200 border ${selectedCategory === item.name ? 'border-[#FEA928]' : 'border-gray-700'}`,
                            ]}
                        >
                            <Material
                                name={item.icon}
                                size={25}
                                color={selectedCategory === item.name ? '#FEA928' : (isDarkMode ?  '#FFF8EC' : '#374151')}
                            />
                        </TouchableOpacity>

                    )}
                    contentContainerStyle={tailwind`flex-1 justify-between`} // Optional padding for the list
                />


            </View>
            <ScrollView
                style={tailwind`flex-1`}
                contentContainerStyle={tailwind`py-2`}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    {postsLoading ? (
                        [...Array(4)].map((_, index) => <CardSkeleton key={index} isDarkMode={isDarkMode} />)
                    ) : (
                        posts.map((post, index) => (
                            post.isAccepted && (
                                <Card
                                    key={index}
                                    post={post}
                                    userId={user.id}
                                    likePost={likePost}
                                    onPostClick={() => handlePostClick(post)} // Pass event handler
                                    onCommentsClick={handleCommentsClick} // Pass event handler
                                />
                            )
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Post Overlay */}
            {selectedPost  && (
                <PostOverlay
                    visible={overlayVisible}
                    post={selectedPost}
                    isDarkMode={isDarkMode}
                    onClose={handleOverlayClose}
                />
            )}
            {postComments && (
                <CommentsOverlay
                    visible={commentsOverlayVisible}
                    loading={commentsLoading}
                    comments={postComments}
                    postId={selectedPost?._id}
                    isDarkMode={isDarkMode}
                    onClose={handleOverlayClose}
                />
            )}

        </View>
    );
};

export default HomeScreen;
