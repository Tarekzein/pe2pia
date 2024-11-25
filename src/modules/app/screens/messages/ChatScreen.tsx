import React from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import tailwind from "twrnc";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const ChatScreen = () => {
  // Example chat data
  const messages = [
    { id: "1", text: "Hello!", type: "received" },
    { id: "2", text: "Hi, how can I help you?", type: "sent" },
    { id: "3", text: "I need some assistance with my account.", type: "received" },
    { id: "4", text: "Sure, let me check that for you.", type: "sent" },
    { id: "5", text: "Thanks!", type: "received" },
  ];

  return (
    <View style={tailwind`flex-1 bg-gray-100`}>
      {/* Chat Header */}
      <View style={tailwind`flex-row items-center p-4 bg-white border-b border-gray-300`}>
        <View style={tailwind`w-10 h-10 rounded-full bg-gray-400 mr-3`} />
        <Text style={tailwind`text-lg font-bold text-blue-900`}>First Last</Text>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={tailwind`
              max-w-[75%] p-3 rounded-lg my-1
              ${item.type === "sent" ? "self-end bg-[#FFF8EC]" : "self-start bg-[#D9D9D9]"}
            `}
          >
            <Text style={tailwind`text-sm text-gray-800`}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={tailwind`px-4 py-2`}
      />

      {/* Message Input Box */}
      <View style={tailwind`flex-row items-center p-3 border-t border-gray-300 bg-white`}>
        <TouchableOpacity style={tailwind`mx-2`}>
            <Icon name="attachment" size={30} color={'#FEA928'} />
        </TouchableOpacity>
        <TextInput
          style={tailwind`flex-1 h-10 bg-gray-200 rounded-full px-4 text-sm text-gray-800`}
          placeholder="Write a message"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity style={tailwind`mx-2`}>
            <Icon name="microphone" size={30} color={'#FEA928'} />
        </TouchableOpacity>
        <TouchableOpacity style={tailwind`ml-2`}>
            <Icon name="send" size={30} color={'#FEA928'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
