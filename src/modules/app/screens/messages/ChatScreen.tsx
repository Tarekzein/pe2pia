import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SectionList, Image } from "react-native";
import tailwind from "twrnc";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from "react-native-vector-icons/MaterialIcons.js";
import { useTheme } from "../../../../context/ThemeContext";
import { useMessages } from "../../context/MessagesContext.tsx";
import { launchImageLibrary } from "react-native-image-picker"; // Import image picker

interface ChatScreenProps {
    navigation: any;
    route: any;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
    const { theme } = useTheme();
    const { fetchMessages, sendMessage, messages: fetchedMessages } = useMessages();
    const isDarkMode = theme === "dark";
    const { chat, user } = route.params;
    const otherUser = chat.members.find((member: { id: any }) => member.id !== user.id) ?? {};

    const [messageInput, setMessageInput] = useState(''); // State for message text

    useEffect(() => {
        fetchMessages(chat._id);
    }, [chat]);

    // In ChatScreen.tsx

    const messages = [...fetchedMessages] // Create a shallow copy
        .sort(
            (a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .map((message) => ({
            id: message.id,
            text: message.text,
            image: message.image,
            type: message.senderId === user.id ? 'sent' : 'received',
            time: new Date(message.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
            date: new Date(message.createdAt).toLocaleDateString(),
            createdAt: message.createdAt,
            status: message.status || (message.senderId === user.id ? 'sent' : null),
        }));

    function getDateTitle(dateString: string) {
        const messageDate = new Date(dateString);
        const today = new Date();

        const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const diffTime = todayDateOnly.getTime() - messageDateOnly.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return "Today";
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return messageDate.toLocaleDateString(undefined, { weekday: "long" });
        } else {
            return messageDate.toLocaleDateString();
        }
    }

    const groupedMessages = messages.reduce((groups: any, message: any) => {
        const dateTitle = getDateTitle(message.createdAt);

        if (!groups[dateTitle]) {
            groups[dateTitle] = [];
        }
        groups[dateTitle].push(message);

        return groups;
    }, {});

    const sections = Object.keys(groupedMessages).map((dateTitle) => ({
        title: dateTitle,
        data: groupedMessages[dateTitle],
    }));

// In ChatScreen.tsx

    const handleSendMessage = () => {
        if (messageInput.trim() === '') return; // Prevent sending empty messages

        const messagePayload = {
            conversationId: chat._id,
            senderId: user.id,
            text: messageInput,
            image: null,
        };

        try {
            sendMessage(messagePayload);
        }catch(error){
            console.error(error);
        }

        setMessageInput(''); // Clear input after sending
    };

    const handlePickImage = () => {
        launchImageLibrary({ mediaType: "photo", includeBase64: true }, (response) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.errorMessage) {
                console.log("ImagePicker Error: ", response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const image = response.assets[0];
                handleSendMessageWithImage(image);
            }
        });
    };

    const handleSendMessageWithImage = (image: any) => {
        const messagePayload = {
            conversationId: chat._id,
            senderId: user.id,
            text: messageInput || '', // Include any text if present
            image: `data:${image.type};base64,${image.base64}`, // Base64 encoded image
        };

        try {
            sendMessage(messagePayload);
        }catch(error){
            console.error(error);
        }

        setMessageInput(''); // Clear input after sending
    };

    const retrySendMessage = (message: any) => {
        const messagePayload = {
            conversationId: chat._id,
            senderId: user.id,
            text: message.text,
            image: message.image,
        };
        try {
            sendMessage(messagePayload);
        }catch(error){
            console.error(error);
        }
    };
    return (
        <View
            style={[
                tailwind`flex-1`,
                isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-gray-100`,
            ]}
        >
            {/* Chat Header */}
            <View
                style={[
                    tailwind`flex-row items-center p-4 border-b`,
                    isDarkMode
                        ? tailwind`border-gray-700 bg-gray-800`
                        : tailwind`border-gray-300 bg-white`,
                ]}
            >
                <Image
                    source={{ uri: otherUser.profilePicture.url }}
                    style={tailwind`w-10 h-10 rounded-full bg-gray-400 mr-3`}
                />
                <Text
                    style={[
                        tailwind`text-lg font-bold`,
                        isDarkMode ? tailwind`text-white` : tailwind`text-[#00347D]`,
                    ]}
                >
                    {`${otherUser.FirstName || ""} ${otherUser.LastName || ""}`}
                </Text>
                {chat.isTyping && (
                    <Text style={tailwind`text-sm text-gray-500 ml-2`}>typing...</Text>
                )}
            </View>

            {/* Chat Messages */}
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                // In ChatScreen.tsx

                renderItem={({ item }) => (
                    <View>
                        <View
                            style={[
                                tailwind`max-w-[75%] my-2 rounded-10 overflow-hidden`,
                                item.type === 'sent'
                                    ? isDarkMode
                                        ? tailwind`self-end bg-[#FEA928] rounded-tr-none`
                                        : tailwind`self-end bg-[#FFF8EC] rounded-tr-none`
                                    : isDarkMode
                                        ? tailwind`self-start bg-gray-700 rounded-tl-none`
                                        : tailwind`self-start bg-[#D9D9D9] rounded-tl-none`,
                            ]}
                        >
                            {item.image && (
                                <Image
                                    source={{ uri: item.image }}
                                    style={tailwind`w-full h-40`}
                                    resizeMode="cover"
                                />
                            )}
                            {item.text ? (
                                <Text
                                    style={[
                                        tailwind`text-sm font-bold p-4`,
                                        isDarkMode ? tailwind`text-white` : tailwind`text-gray-800`,
                                    ]}
                                >
                                    {item.text}
                                </Text>
                            ) : null}
                        </View>
                        <View
                            style={[
                                tailwind`flex-row items-center mt-1 max-w-[75%]`,
                                item.type === 'sent' ? tailwind`self-end` : tailwind`self-start`,
                            ]}
                        >
                            <Text
                                style={[
                                    tailwind`text-xs`,
                                    isDarkMode ? tailwind`text-gray-300` : tailwind`text-gray-500`,
                                ]}
                            >
                                {item.time}
                            </Text>
                            {item.type === 'sent' && item.status && (
                                <MaterialIcon
                                    name={
                                        item.status === 'sent'
                                            ? 'done' // Single check mark
                                            : item.status === 'sending'
                                                ? 'access-time' // Clock icon
                                                : item.status === 'failed'
                                                    ? 'error' // Error icon
                                                    : null
                                    }
                                    size={16}
                                    color={
                                        item.status === 'failed'
                                            ? 'red'
                                            : isDarkMode
                                                ? '#FFF'
                                                : '#000'
                                    }
                                    style={tailwind`ml-1`}
                                />
                            )}
                        </View>
                        {item.status === 'failed' && item.type === 'sent' && (
                            <TouchableOpacity onPress={() => retrySendMessage(item)}>
                                <Text style={[tailwind`text-xs text-red-500`, tailwind`ml-2`]}>Retry</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={tailwind`py-2`}>
                        <Text
                            style={[
                                tailwind`text-center text-gray-500`,
                                isDarkMode ? tailwind`text-gray-300` : tailwind`text-gray-500`,
                            ]}
                        >
                            {title}
                        </Text>
                    </View>
                )}
                contentContainerStyle={tailwind`px-4 py-2`}
            />

            {/* Message Input Box */}
            <View
                style={[
                    tailwind`flex-row items-center p-3 border-t`,
                    isDarkMode
                        ? tailwind`border-gray-700 bg-gray-800`
                        : tailwind`border-gray-300 bg-white`,
                ]}
            >
                <TouchableOpacity style={tailwind`mx-2`} onPress={handlePickImage}>
                    <Icon name="attachment" size={30} color={"#FEA928"} />
                </TouchableOpacity>
                <TextInput
                    style={[
                        tailwind`flex-1 h-10 rounded-full px-4 text-sm`,
                        isDarkMode
                            ? tailwind`bg-gray-700 text-white`
                            : tailwind`bg-gray-200 text-gray-800`,
                    ]}
                    placeholder="Write a message"
                    placeholderTextColor="#9CA3AF"
                    value={messageInput}
                    onChangeText={setMessageInput}
                />
                <TouchableOpacity style={tailwind`mx-2`}>
                    <Icon name="microphone" size={30} color={"#FEA928"} />
                </TouchableOpacity>
                <TouchableOpacity style={tailwind`ml-2`} onPress={handleSendMessage}>
                    <Icon name="send" size={30} color={"#FEA928"} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatScreen;