import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Using Feather Icons
import tailwind from 'twrnc';

interface SearchFieldProps {
    navigation: any;
    searchValue: string;
    setSearchValue: (value: string) => void;
    handleSearch: (query: string) => void;
    isDarkMode: boolean;
}

const SearchField: React.FC<SearchFieldProps> = ({ navigation, searchValue, setSearchValue,handleSearch,isDarkMode }) => {
    return (
      <View style={tailwind`relative w-full`}>
        {/* Left Icon */}
        <TouchableOpacity
          style={tailwind`absolute z-1 inset-y-0 left-3 flex justify-center`}
          onPress={() => {
              if (searchValue !== ''){
                setSearchValue('');
              }else {
                navigation.goBack();
              }
          }}>
          <Icon
            name="arrow-left"
            size={20}
            style={
              isDarkMode ? tailwind`text-[#f4f4f4]` : tailwind`text-[#00347D]`
            }
          />
        </TouchableOpacity>

        {/* Input Field */}
        <TextInput
          value={searchValue}
          onChangeText={setSearchValue}
          onChange={e => handleSearch(e.nativeEvent.text)}
          placeholder=""
          style={[
            tailwind`border-2 text-lg rounded-full w-full pl-12 pr-12 py-2 text-center`,
            isDarkMode
              ? tailwind`bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500`
              : tailwind`bg-transparent border-[#00347D] text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:text-white`,
          ]}
          placeholderTextColor={tailwind.color('[#00347D]')}
        />

        {/* Right Icon Button */}
        <TouchableOpacity
          style={tailwind`absolute inset-y-0 right-3 flex justify-center`}
          onPress={() => console.log('Search action triggered')}>
          <Icon
            name="search"
            size={20}
            style={tailwind`text-[#FFB300] font-bold dark:text-gray-400`}
          />
        </TouchableOpacity>
      </View>
    );
};

export default SearchField;
