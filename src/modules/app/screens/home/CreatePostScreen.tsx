import React from "react";
import {Text, View} from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import tailwind from "twrnc";
import Icon from "react-native-vector-icons/Feather";

interface CreatePostScreenProps {
    navigation: any;
}

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({navigation}) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const backgroundColor = isDarkMode ? tailwind`bg-gray-800`.backgroundColor : '#FFF8EC';

    return (
        <View style={[tailwind`py-4 flex-1`,{
            backgroundColor
        }]}>
            {/* Header */}
            <View style={tailwind`flex-row relative items-center border-b mt-5 px-5 pb-3`}>
                <Icon
                    name="x"
                    style={tailwind`absolute left-5 top-0`}
                    size={30}
                    color={isDarkMode ? "#fff" : "#00347D"}
                    onPress={() => navigation.goBack()}
                />
                <Text
                    style={isDarkMode ? tailwind`text-2xl font-bold mx-auto text-[#FEA928]` : tailwind`text-2xl font-bold mx-auto text-[#FEA928]`}
                >
                    Create Post
                </Text>
            </View>
        </View>
    );
};

export default CreatePostScreen;