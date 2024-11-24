import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Using Feather Icons
import tailwind from 'twrnc';

interface SearchFieldProps {
    navigation: any;
    searchValue: string;
    setSearchValue: (value: string) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({ navigation, searchValue, setSearchValue }) => {
    return (
      <View style={tailwind`relative w-full`}>
          {/* Left Icon */}
          <TouchableOpacity
            style={tailwind`absolute inset-y-0 left-3 flex justify-center`}
            onPress={() => navigation.goBack()}
          >
              <Icon
                name="arrow-left"
                size={20}
                style={tailwind`text-[#00347D] dark:text-gray-400 hover:text-gray-900 dark:hover:text-white`}
              />
          </TouchableOpacity>

          {/* Input Field */}
          <TextInput
            value={searchValue}
            onChangeText={setSearchValue}
            placeholder=""
            style={tailwind`bg-transparent border-2 border-[#00347D] text-gray-900 text-lg rounded-full focus:ring-blue-500 focus:border-blue-500 w-full pl-12 pr-12 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center`}
            placeholderTextColor={tailwind.color('[#00347D]')}
          />

          {/* Right Icon Button */}
          <TouchableOpacity
            style={tailwind`absolute inset-y-0 right-3 flex justify-center`}
            onPress={() => console.log('Search action triggered')}
          >
              <Icon name="search" size={20} style={tailwind`text-[#FFB300] font-bold dark:text-gray-400`} />
          </TouchableOpacity>
      </View>
    );
};

export default SearchField;
