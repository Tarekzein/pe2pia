import React, { useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../../../context/ThemeContext';
import { useAuth } from '../../../../context/AuthContext';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import { useHome } from '../../context/HomeContext.tsx';

interface CreatePostScreenProps {
    navigation: any;
}

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ navigation }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { createPost, createPostLoading,createPostError } = useHome();
    const isDarkMode = theme === 'dark';
    const backgroundColor = isDarkMode ? tailwind`bg-gray-800`.backgroundColor : '#FFF8EC';

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedType, setSelectedType] = useState('others');
    const [selectedImages, setSelectedImages] = useState<any[]>([]);
    const [postText, setPostText] = useState('');

    const categoryTypes = ['cats', 'dogs', 'birds', 'turtles', 'fishes', 'others'];

    // Handle Image Selection
    const handleImageSelection = async () => {
        const options = {
            mediaType: 'photo',
            quality: 0.7,
            selectionLimit: 100, // Allow unlimited selection
        };

        // @ts-ignore
        const response = await launchImageLibrary(options);

        if (response.didCancel) return;
        if (response.errorCode) {
            console.error('Error selecting images:', response.errorMessage);
            Toast.show({
                type: 'error',
                text1: 'Error selecting images',
                text2: response.errorMessage,
            });
            return;
        }

        if (response.assets) {
            const newImages = response.assets;
            setSelectedImages((prev) => [...prev, ...newImages]);
        }
    };

    // Handle Post Submission
    const handleSubmission = async () => {
        if (!postText.trim()) {
            return Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Post text is required.',
            });
        }

        const postData = new FormData();
        postData.append('title', 'Post Title');
        postData.append('description', postText);
        postData.append('category', selectedType);
        selectedImages.forEach((image) => {
            postData.append(`image`, {
                name: image.fileName || 'image.jpg',
                type: image.type || 'image/jpeg',
                uri: image.uri,
            });
        });

        try {
            console.log('Post Data:', postData);
            await createPost(postData);

            if (createPostError) {
                 Toast.show({
                    type: 'error',
                    text1: 'Error creating post',
                    text2: createPostError.message,
                });
                return;
            }

            Toast.show({
                type: 'success',
                text1: 'Post created successfully!',
            });
            navigation.navigate('Home');
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Error creating post',
                text2: err.message,
            });
        }
    };

    return (
        <View
            style={[
                tailwind`flex-1`,
                {
                    backgroundColor,
                },
            ]}
        >
            {/* Header */}
            <View
                style={tailwind`flex-row relative items-center border-b ${
                    isDarkMode ? 'border-gray-500' : 'border-gray-300'
                } mt-5 px-5 pb-3`}
            >
                <Icon
                    name="x"
                    style={tailwind`absolute left-5 top-0`}
                    size={30}
                    color={isDarkMode ? '#fff' : '#00347D'}
                    onPress={() => navigation.goBack()}
                />
                <Text
                    style={
                        isDarkMode
                            ? tailwind`text-2xl font-bold mx-auto text-[#FEA928]`
                            : tailwind`text-2xl font-bold mx-auto text-[#FEA928]`
                    }
                >
                    Create Post
                </Text>
                <TouchableOpacity
                    style={[
                        tailwind`absolute top-0 right-5 rounded-md`,
                        {
                            backgroundColor: postText.trim()
                                ? '#FEA928'
                                : isDarkMode
                                    ? '#4B5563'
                                    : '#D1D5DB',
                        },
                    ]}
                    disabled={!postText.trim() || createPostLoading}
                    onPress={handleSubmission}
                >
                    {createPostLoading ? (
                        <ActivityIndicator size="small" color="#fff" style={tailwind`py-2 px-5`} />
                    ) : (
                        <Text
                            style={tailwind`text-lg font-semibold text-white px-3 py-1`}
                        >
                            Post
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={tailwind`px-5 mt-5`}>
                {/* User Profile and Dropdown */}
                <View style={tailwind`flex-row justify-between mb-5`}>
                    <View style={tailwind`flex-row items-center`}>
                        <Image
                            source={{ uri: user?.profilePicture.url }}
                            style={tailwind`w-12 h-12 rounded-full`}
                        />
                        <View style={tailwind`ml-3`}>
                            <Text
                                style={tailwind`text-lg mb-2 font-bold ${
                                    isDarkMode ? 'text-white' : 'text-[#00347D]'
                                }`}
                            >
                                {user?.FirstName} {user?.LastName}
                            </Text>
                            <View style={tailwind`relative`}>
                                <TouchableOpacity
                                    onPress={() => setDropdownVisible(!dropdownVisible)}
                                    style={tailwind`flex-row items-center justify-between border ${
                                        isDarkMode ? 'border-gray-500' : 'border-gray-300'
                                    } rounded-md px-2 py-1`}
                                >
                                    <Text style={tailwind`text-[#FEA928] text-sm font-semibold`}>
                                        {selectedType}
                                    </Text>
                                    <Icon name="chevron-down" size={18} color="#FEA928" />
                                </TouchableOpacity>
                                {dropdownVisible && (
                                    <View
                                        style={[
                                            tailwind`absolute top-7 left-0 rounded-md shadow-lg`,
                                            {
                                                backgroundColor: isDarkMode ? '#1F2937' : '#FFF',
                                                width: 150,
                                                zIndex: 10,
                                            },
                                        ]}
                                    >
                                        <FlatList
                                            data={categoryTypes}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setSelectedType(item);
                                                        setDropdownVisible(false);
                                                    }}
                                                    style={tailwind`py-2 px-4 ${
                                                        isDarkMode ? 'border-gray-600' : 'border-gray-200'
                                                    } border-b`}
                                                >
                                                    <Text
                                                        style={tailwind`${
                                                            isDarkMode ? 'text-white' : 'text-[#00347D]'
                                                        } text-sm`}
                                                    >
                                                        {item}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleImageSelection}>
                        <Icon name={'image'} size={25} color={'#FEA928'} />
                    </TouchableOpacity>
                </View>

                {/* Input Area */}
                <TextInput
                    style={[
                        tailwind`text-lg`,
                        {
                            height: 150,
                            backgroundColor: isDarkMode ? '#1F2937' : '#FEF9F3',
                            borderRadius: 10,
                            padding: 10,
                            textAlignVertical: 'top',
                            color: isDarkMode ? '#fff' : '#4B5563',
                        },
                    ]}
                    placeholder="What do you have to share?"
                    placeholderTextColor={isDarkMode ? '#9CA3AF' : '#D1D5DB'}
                    multiline
                    value={postText}
                    onChangeText={(text) => setPostText(text)}
                />

                {/* Selected Images */}
                {selectedImages.length > 0 && (
                    <View style={tailwind`mt-5 flex-row flex-wrap`}>
                        {selectedImages.map((image, index) => (
                            <View key={index} style={tailwind`relative mr-2 mb-2`}>
                                <Image
                                    source={{ uri: image.uri }}
                                    style={tailwind`w-20 h-20 rounded-md`}
                                />
                                <TouchableOpacity
                                    style={tailwind`absolute -top-2 -right-2 bg-red-500 p-1 rounded-full`}
                                    onPress={() => {
                                        setSelectedImages((prev) =>
                                            prev.filter((_, i) => i !== index)
                                        );
                                    }}
                                >
                                    <Icon name="trash" size={16} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

export default CreatePostScreen;
