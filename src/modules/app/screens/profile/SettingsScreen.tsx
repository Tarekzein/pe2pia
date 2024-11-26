import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <View style={tailwind`flex-1 bg-[#FFF8EC]`}>
      {/* Header */}
      <View style={tailwind`flex-row relative items-center mt-10 mx-5`}>
        <Icon
          name="arrow-left"
          style={tailwind`absolute`}
          size={30}
          color="#00347D"
          onPress={() => navigation.goBack()}
        />
        <Text style={tailwind`text-2xl font-bold mx-auto text-[#FEA928]`}>
          Settings
        </Text>
      </View>

      {/* Settings Options */}
      <View style={tailwind`mt-10 mx-6`}>
        {/* Option 1: Edit Profile */}
        <TouchableOpacity style={tailwind`flex-row items-center py-4`}>
          <Icon name="user" size={30} color="#00347D" />
          <Text style={tailwind`ml-4 text-xl font-bold text-[#FEA928]`}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Option 2: Languages */}
        <TouchableOpacity style={tailwind`flex-row items-center py-4`}>
          <Icon name="globe" size={30} color="#00347D" />
          <Text style={tailwind`ml-4 text-xl font-bold text-[#FEA928]`}>Languages</Text>
        </TouchableOpacity>

        {/* Option 3: Notifications */}
        <TouchableOpacity style={tailwind`flex-row items-center py-4`}>
          <Icon name="bell" size={30} color="#00347D" />
          <Text style={tailwind`ml-4 text-xl font-bold text-[#FEA928]`}>Notifications</Text>
        </TouchableOpacity>

        {/* Option 4: Help & Support */}
        <TouchableOpacity style={tailwind`flex-row items-center py-4`}>
          <Icon name="help-circle" size={30} color="#00347D" />
          <Text style={tailwind`ml-4 text-xl font-bold text-[#FEA928]`}>
            Help & Support
          </Text>
        </TouchableOpacity>

        {/* Option 5: Dark Mode */}
        <View style={tailwind`flex-row items-center py-4`}>
          <Icon name="moon" size={30} color="#00347D" />
          <Text style={tailwind`ml-4 text-xl font-bold text-[#FEA928]`}>Dark Mode</Text>
          <Switch
            style={tailwind`ml-auto`}
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            thumbColor={isDarkMode ? "#FEA928" : "#FFF"}
            trackColor={{ false: "#D6D9DA", true: "#00347D" }}
          />
        </View>

        {/* Option 6: Log Out */}
        <TouchableOpacity style={tailwind`flex-row items-center py-4`}>
          <Icon name="log-out" size={30} color="#00347D" />
          <Text style={tailwind`ml-4 text-xl font-bold text-[#FEA928]`}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;
