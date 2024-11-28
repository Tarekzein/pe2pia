import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tailwind from "twrnc";
import { useTheme } from "../../../../context/ThemeContext";
import Icon from "react-native-vector-icons/Feather";

interface LanguageScreenProps {
  navigation: any;
}

const LanguageScreen: React.FC<LanguageScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <View
      style={
        isDarkMode
          ? tailwind`flex-1 bg-gray-800`
          : tailwind`flex-1 bg-[#FFF8EC]`
      }
    >
      {/* Header */}
      <View style={tailwind`flex-row relative items-center mt-10 mx-5`}>
        <Icon
          name="arrow-left"
          style={tailwind`absolute`}
          size={30}
          color={isDarkMode ? "#fff" : "#00347D"}
          onPress={() => navigation.goBack()}
        />
        <Text
          style={tailwind`text-2xl font-bold mx-auto ${
            isDarkMode ? "text-[#FEA928]" : "text-[#FEA928]"
          }`}
        >
          Languages
        </Text>
      </View>

      {/* Language Options */}
      <View style={tailwind`mt-10 mx-5`}>

        {/* Radio Button for English */}
        <TouchableOpacity
          style={tailwind`flex-row items-center justify-between px-5 mb-5`}
          onPress={() => handleLanguageSelect("English")}
        >

          <Text
            style={tailwind`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-[#00347D]"
            }`}
          >
            English
          </Text>

          <View
            style={[
              tailwind`w-6 h-6 rounded-full border-2`,
              selectedLanguage === "English"
                ? tailwind`border-[#FEA928] bg-[#FEA928]`
                : isDarkMode
                  ? tailwind`border-gray-500`
                  : tailwind`border-gray-400`,
            ]}
          />
        </TouchableOpacity>

        {/* Radio Button for Arabic */}
        <TouchableOpacity
          style={tailwind`flex-row items-center justify-between px-5 mb-4`}
          onPress={() => handleLanguageSelect("Arabic")}
        >
          <Text
            style={tailwind`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-[#00347D]"
            }`}
          >
            Arabic
          </Text>
          <View
            style={[
              tailwind`w-6 h-6 rounded-full border-2 `,
              selectedLanguage === "Arabic"
                ? tailwind`border-[#FEA928] bg-[#FEA928]`
                : isDarkMode
                  ? tailwind`border-gray-500`
                  : tailwind`border-gray-400`,
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LanguageScreen;
