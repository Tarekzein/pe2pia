import React from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import tailwind from "twrnc";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../../context/ThemeContext';

interface ChatScreenProps {
  navigation: any;
}

const ChatScreen:React.FC<ChatScreenProps> = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Example chat data
  const messages = [
    { id: "1", text: "Hello!", type: "received" },
    { id: "2", text: "Hi, how can I help you?", type: "sent" },
    { id: "3", text: "I need some assistance with my account. I need some assistance with my account. I need some assistance with my account.", type: "received" },
    { id: "4", text: "Sure, let me check that for you.", type: "sent" },
    { id: "5", text: "Thanks!", type: "received" },
  ];

  return (
    <View style={[tailwind`flex-1`,
      isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-gray-100`
    ]}>
      {/* Chat Header */}
      <View style={[tailwind`flex-row items-center p-4  border-b`,
        isDarkMode ? tailwind`border-gray-700` : tailwind`border-gray-300 bg-white`
      ]}>
        <View style={tailwind`w-10 h-10 rounded-full bg-gray-400 mr-3`} />
        <Text style={[tailwind`text-lg font-bold`
          ,isDarkMode ? tailwind`text-white` : tailwind`text-[#00347D]`
        ]}>First Last</Text>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[tailwind`
                max-w-[75%] p-6 my-2 rounded-10
                ${item.type === "sent" ? "self-end bg-[#FFF8EC] rounded-tr-none" : "self-start bg-[#D9D9D9] rounded-tl-none"}`,
              isDarkMode ? tailwind`bg-gray-700` : tailwind`bg-gray-200`
            ]}
          >

          <Text style={[tailwind`text-sm text-gray-800`,
            isDarkMode ? tailwind`text-white` : tailwind`text-gray-800`
          ]}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={tailwind`px-4 py-2`}
      />

      {/* Message Input Box */}
      <View style={[tailwind`flex-row items-center p-3 border-t`,
        isDarkMode ? tailwind`border-gray-700 bg-gray-800` : tailwind`border-gray-300 bg-white`
      ]}>
        <TouchableOpacity style={tailwind`mx-2`}>
            <Icon name="attachment" size={30} color={'#FEA928'} />
        </TouchableOpacity>
        <TextInput
          style={[tailwind`flex-1 h-10  rounded-full px-4 text-sm `,
            isDarkMode ? tailwind`bg-gray-700 text-white` : tailwind`bg-gray-200 text-gray-800`
          ]}
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
