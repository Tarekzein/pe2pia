// ConfirmationModal.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';

interface ConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: any;
  isDarkMode: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
                                                               isVisible,
                                                               onClose,
                                                               onConfirm,
                                                               user,
                                                               isDarkMode,
                                                             }) => (
  <Modal
    isVisible={isVisible}
    onBackdropPress={onClose}
    onSwipeComplete={onClose}
    swipeDirection={['down']}
    style={tailwind`m-0 justify-end`}
    useNativeDriver
    useNativeDriverForBackdrop
  >
    <View style={[
      tailwind`rounded-t-3xl p-6`,
      isDarkMode ? tailwind`bg-gray-900` : tailwind`bg-white`
    ]}>
      <View style={tailwind`w-12 h-1 bg-gray-300 rounded-full self-center mb-6`} />

      <Text style={[
        tailwind`text-xl font-bold mb-4`,
        isDarkMode ? tailwind`text-white` : tailwind`text-gray-900`
      ]}>
        Start Conversation
      </Text>

      <Text style={[
        tailwind`text-base mb-6`,
        isDarkMode ? tailwind`text-gray-300` : tailwind`text-gray-600`
      ]}>
        Do you want to start a conversation with {user?.FirstName} {user?.LastName}?
      </Text>

      <View style={tailwind`flex-row justify-end`}>
        <TouchableOpacity
          onPress={onClose}
          style={[
            tailwind`px-4 py-2 rounded-full mr-3`,
            isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-gray-100`
          ]}
        >
          <Text style={[
            tailwind`font-medium`,
            isDarkMode ? tailwind`text-gray-300` : tailwind`text-gray-600`
          ]}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onConfirm}
          style={tailwind`bg-[#FEA928] px-4 py-2 rounded-full`}
        >
          <Text style={tailwind`text-white font-medium`}>
            Start Chat
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default ConfirmationModal;
