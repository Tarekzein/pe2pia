import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import tailwind from "twrnc";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../../../../context/ThemeContext";
import { useMessages } from "../../context/MessagesContext.tsx";
import { launchImageLibrary } from "react-native-image-picker";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue
} from 'react-native-reanimated';
import Modal from 'react-native-modal';
import { useIsFocused } from '@react-navigation/native';

interface ChatScreenProps {
  navigation: any;
  route: any;
}
interface SelectedImage {
  uri: string;
  type: string;
  base64: string;
}


const ImagePreviewModal = React.memo(({
                                        isVisible,
                                        onClose,
                                        images,
                                        onRemoveImage,
                                        onSend,
                                        messageInput,
                                        onMessageChange,
                                        isDarkMode
                                      }: {
  isVisible: boolean;
  onClose: () => void;
  images: SelectedImage[];
  onRemoveImage: (index: number) => void;
  onSend: () => void;
  messageInput: string;
  onMessageChange: (text: string) => void;
  isDarkMode: boolean;
}) => (
  <Modal
    isVisible={isVisible}
    onBackdropPress={onClose}
    onSwipeComplete={onClose}
    swipeDirection={['down']}
    style={tailwind`m-0 justify-end`}
    useNativeDriver
    useNativeDriverForBackdrop
    propagateSwipe
    backdropTransitionOutTiming={0}
    animationInTiming={300}
    animationOutTiming={300}
  >
    <View style={[
      tailwind`bg-white rounded-t-3xl p-4`,
      isDarkMode && tailwind`bg-gray-800`
    ]}>
      <View style={tailwind`w-12 h-1 bg-gray-300 rounded-full self-center mb-4`} />

      <View style={tailwind`flex-row justify-between items-center mb-4`}>
        <Text style={[
          tailwind`text-lg font-bold`,
          isDarkMode ? tailwind`text-white` : tailwind`text-gray-800`
        ]}>
          Preview Images ({images.length})
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tailwind`mb-4`}
        contentContainerStyle={tailwind`p-1`}
      >
        {images.map((image, index) => (
          <View key={index} style={[
            tailwind`mr-2 relative`,
            {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5
            }
          ]}>
            <Image
              source={{ uri: image.uri }}
              style={tailwind`w-24 h-24 rounded-lg`}
            />
            <TouchableOpacity
              style={tailwind`absolute -top-2 -right-2 bg-red-500 rounded-full p-1`}
              onPress={() => onRemoveImage(index)}
            >
              <Icon name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TextInput
        style={[
          tailwind`rounded-full px-4 py-2 mb-4`,
          isDarkMode ? tailwind`bg-gray-700 text-white` : tailwind`bg-gray-200 text-gray-800`
        ]}
        placeholder="Add a caption..."
        placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
        value={messageInput}
        onChangeText={onMessageChange}
      />

      <TouchableOpacity
        style={[
          tailwind`rounded-full py-3 items-center`,
          { backgroundColor: '#FEA928' }
        ]}
        onPress={onSend}
      >
        <Text style={tailwind`text-white font-bold`}>
          Send Images
        </Text>
      </TouchableOpacity>
    </View>
  </Modal>
));

const ChatScreen: React.FC<ChatScreenProps> = ({ route,navigation }) => {
  const isFocused = useIsFocused();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();
  const { fetchMessages, sendMessage, messages: fetchedMessages } = useMessages();
  const [loading, setLoading] = useState(false);
  const isDarkMode = theme === "dark";
  const { chat, user } = route.params;
  const otherUser = chat.members.find((member: { id: any }) => member.id !== user.id) ?? {};
  const scrollViewRef = useRef<ScrollView>(null);
  const [messageInput, setMessageInput] = useState('');
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [showImagePreview, setShowImagePreview] = useState(false);
  // Add animation value for skeleton loading
  const opacity = useSharedValue(0.3);

  // Initialize animation
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 500 }),
        withTiming(0.3, { duration: 500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        await fetchMessages(chat._id);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    // Initial fetch with loading state
    const initialFetch = async () => {
      setLoading(true);
      try {
        await fetchChatMessages();
      } finally {
        setLoading(false);
      }
    };

    initialFetch();

    // Set up interval when screen is focused
    if (isFocused) {
      intervalRef.current = setInterval(fetchChatMessages, 3000);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isFocused, chat._id]); // Dependencies

// Optional: Clear interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    });

    return unsubscribe;
  }, [navigation]);

  const messages = [...fetchedMessages]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((message, index, array) => {
      const currentDate = new Date(message.createdAt).toLocaleDateString();
      const previousDate = index > 0
        ? new Date(array[index - 1].createdAt).toLocaleDateString()
        : null;

      return {
        id: message._id,
        text: message.text,
        files: message.files || [], // Add files handling
        type: message.senderId === user.id ? 'sent' : 'received',
        time: new Date(message.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        date: currentDate,
        showDate: currentDate !== previousDate,
        dateTitle: getDateTitle(message.createdAt),
        createdAt: message.createdAt,
        status: message.status || (message.senderId === user.id ? 'sent' : null),
      };
    });

  function getDateTitle(dateString: string) {
    const messageDate = new Date(dateString);
    const today = new Date();
    const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffTime = todayDateOnly.getTime() - messageDateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return messageDate.toLocaleDateString(undefined, { weekday: "long" });
    return messageDate.toLocaleDateString();
  }


  const handleSendMessage = async () => {
    if (messageInput.trim() === '') return;

    try {
      const messagePayload = {
        conversationId: chat._id,
        senderId: user.id,
        text: messageInput,
      };

      sendMessage(messagePayload);
      setMessageInput('');
    } catch(error) {
      console.error('Error sending message:', error);
    }
  };

  const handlePickImage = () => {
    launchImageLibrary({
      mediaType: "photo",
      includeBase64: true,
      selectionLimit: 0, // 0 means unlimited
      quality: 0.8,
    }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const newImages = response.assets.map(asset => ({
          uri: asset.uri || '',
          type: asset.type || 'image/jpeg',
          base64: asset.base64 || '',
        }));
        setSelectedImages(newImages);
        setShowImagePreview(true);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    if (newImages.length === 0) {
      setShowImagePreview(false);
    }
  };

  const handleSendMessageWithImages = async () => {
    if (selectedImages.length === 0 && messageInput.trim() === '') return;

    try {
      const formData = new FormData();

      // Append each image as a file
      selectedImages.forEach((image, index) => {
        formData.append('image', {
          uri: image.uri,
          type: image.type,
          name: `image-${index}.${image.type.split('/')[1]}`,
        });
      });

      // Append other message data
      formData.append('conversationId', chat._id);
      formData.append('senderId', user.id);
      formData.append('text', messageInput);
      sendMessage(formData);

      setSelectedImages([]);
      setShowImagePreview(false);
      setMessageInput('');
    } catch(error) {
      console.error('Error sending message with images:', error);
    }
  };

  const retrySendMessage = async (message: any) => {
    try {
      if (message.files && message.files.length > 0) {
        // Retry with files
        const formData = new FormData();

        message.files.forEach((file: any, index: number) => {
          formData.append('files', {
            uri: file.url,
            type: file.type,
            name: file.public_id,
          });
        });

        formData.append('conversationId', chat._id);
        formData.append('senderId', user.id);
        formData.append('text', message.text || '');

        await sendMessage(formData);
      } else {
        // Retry text-only message
        const messagePayload = {
          conversationId: chat._id,
          senderId: user.id,
          text: message.text,
        };

        await sendMessage(messagePayload);
      }
    } catch(error) {
      console.error('Error retrying message:', error);
    }
  };

  const MessageItem = ({ item }: { item: any }) =>{
    const getStatusIcon = (status: string) => {
      switch(status) {
        case 'read':
          return <MaterialIcon name="done-all" size={16} color="#34B7F1" />;
        case 'sent':
          return <MaterialIcon name="done" size={16} color={isDarkMode ? '#FFF' : '#000'} />;
        case 'sending':
          return <MaterialIcon name="access-time" size={16} color={isDarkMode ? '#FFF' : '#000'} />;
        case 'failed':
          return <MaterialIcon name="error-outline" size={16} color="#FF0000" />;
        default:
          return null;
      }
    };
    return  (
      <View>
        {item.showDate && (
          <View style={tailwind`py-2`}>
            <Text style={[
              tailwind`text-center text-gray-500`,
              isDarkMode ? tailwind`text-gray-300` : tailwind`text-gray-500`,
            ]}>
              {item.dateTitle}
            </Text>
          </View>
        )}
        <View>
          <View style={[
            tailwind`max-w-[75%] my-2 rounded-10 overflow-hidden`,
            item.type === 'sent'
              ? isDarkMode
                ? tailwind`self-end bg-[#FEA928] rounded-tr-none`
                : tailwind`self-end bg-[#FFF8EC] rounded-tr-none`
              : isDarkMode
                ? tailwind`self-start bg-gray-700 rounded-tl-none`
                : tailwind`self-start bg-[#D9D9D9] rounded-tl-none`,
          ]}>
            {/* Handle multiple files */}
            {item.files && item.files.length > 0 && (
              <View style={tailwind`flex-row flex-wrap`}>
                {item.files.map((file: any, index: number) => (
                  <View key={file._id || index} style={tailwind`relative`}>
                    {file.type === 'image' ? (
                      <Image
                        source={{ uri: file.url }}
                        style={[
                          tailwind`w-50 h-40`,
                          item.files.length > 1 && tailwind`w-1/2`,
                        ]}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={tailwind`p-3 flex-row items-center`}>
                        <Icon
                          name="file-document-outline"
                          size={24}
                          color={isDarkMode ? '#fff' : '#000'}
                        />
                        <Text style={[
                          tailwind`ml-2`,
                          isDarkMode ? tailwind`text-white` : tailwind`text-gray-800`,
                        ]}>
                          {file.public_id}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Message text */}
            {item.text ? (
              <Text style={[
                tailwind`text-sm font-bold p-4`,
                isDarkMode ? tailwind`text-white` : tailwind`text-gray-800`,
              ]}>
                {item.text}
              </Text>
            ) : null}
          </View>

          {/* Message status and time */}
          <View style={[
            tailwind`flex-row items-center mt-1 max-w-[75%]`,
            item.type === 'sent' ? tailwind`self-end` : tailwind`self-start`,
          ]}>
            <Text style={[
              tailwind`text-xs`,
              isDarkMode ? tailwind`text-gray-300` : tailwind`text-gray-500`,
            ]}>
              {item.time}
            </Text>

            {item.type === 'sent' && (
              <View style={tailwind`ml-1`}>
                {getStatusIcon(item.status)}
              </View>
            )}
          </View>

          {item.status === 'failed' && item.type === 'sent' && (
            <TouchableOpacity
              onPress={() => retrySendMessage(item)}
              style={tailwind`self-end mt-1`}
            >
              <Text style={tailwind`text-xs text-red-500`}>
                Retry
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // Skeleton message component
  const SkeletonMessage = ({ isReceived }: { isReceived: boolean }) => (
    <View
      style={[
        tailwind`max-w-[75%] my-2`,
        isReceived ? tailwind`self-start` : tailwind`self-end`,
      ]}
    >
      <Animated.View
        style={[
          tailwind`rounded-10 overflow-hidden`,
          isReceived
            ? isDarkMode
              ? tailwind`bg-gray-700`
              : tailwind`bg-gray-300`
            : isDarkMode
              ? tailwind`bg-gray-600`
              : tailwind`bg-gray-200`,
          { height: Math.random() * 40 + 40 }, // Random height for variety
          animatedStyle,
        ]}
      />
      <Animated.View
        style={[
          tailwind`w-16 h-4 mt-1 rounded`,
          isReceived ? tailwind`self-start` : tailwind`self-end`,
          isDarkMode ? tailwind`bg-gray-700` : tailwind`bg-gray-300`,
          animatedStyle,
        ]}
      />
    </View>
  );


  // Loading skeleton component
  const LoadingSkeleton = () => (
    <ScrollView
      contentContainerStyle={tailwind`px-4 py-2`}
    >
      {[...Array(6)].map((_, index) => (
        <SkeletonMessage key={index} isReceived={index % 2 === 0} />
      ))}
    </ScrollView>
  );

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
        {loading ? (
          <Animated.View
            style={[
              tailwind`w-10 h-10 rounded-full bg-gray-400 mr-3`,
              animatedStyle,
            ]}
          />
        ) : (
          <Image
            source={{ uri: otherUser?.profilePicture?.url }}
            style={tailwind`w-10 h-10 rounded-full bg-gray-400 mr-3`}
          />
        )}
        {loading ? (
          <Animated.View
            style={[
              tailwind`w-32 h-6 rounded`,
              isDarkMode ? tailwind`bg-gray-700` : tailwind`bg-gray-300`,
              animatedStyle,
            ]}
          />
        ) : (
          <Text
            style={[
              tailwind`text-lg font-bold`,
              isDarkMode ? tailwind`text-white` : tailwind`text-[#00347D]`,
            ]}
          >
            {`${otherUser.FirstName || ""} ${otherUser.LastName || ""}`}
          </Text>
        )}
      </View>

      {/* Chat Messages */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={tailwind`px-4 py-2`}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map(item => (
            <MessageItem key={item.id} item={item} />
          ))}
        </ScrollView>
      )}
      <ImagePreviewModal
        isVisible={showImagePreview}
        onClose={() => setShowImagePreview(false)}
        images={selectedImages}
        onRemoveImage={handleRemoveImage}
        onSend={handleSendMessageWithImages}
        messageInput={messageInput}
        onMessageChange={setMessageInput}
        isDarkMode={isDarkMode}
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
        <TouchableOpacity
          style={tailwind`mx-2 relative`}
          onPress={handlePickImage}
        >
          <Icon name="attachment" size={30} color={"#FEA928"} />
          {selectedImages.length > 0 && (
            <View style={tailwind`absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center`}>
              <Text style={tailwind`text-white text-xs`}>
                {selectedImages.length}
              </Text>
            </View>
          )}
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
        {/*<TouchableOpacity style={tailwind`mx-2`}>*/}
        {/*    <Icon name="microphone" size={30} color={"#FEA928"} />*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity
          style={tailwind`ml-2`}
          onPress={selectedImages.length > 0 ? handleSendMessageWithImages : handleSendMessage}
        >
          <Icon name="send" size={30} color={"#FEA928"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
