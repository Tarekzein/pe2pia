import React, { useState } from 'react';
import { View } from 'react-native';
import tailwind from 'twrnc';
import SearchField from '../components/search/SearchField';
import SearchHistory from '../components/search/SearchHistory';
import {useTheme} from '../../../context/ThemeContext';

interface HomeScreenProps {
  navigation: any;
}

const SearchScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState(''); // State to manage input value
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  return (
    <View style={[tailwind` h-full p-5 pb-25`,isDarkMode? tailwind`bg-gray-800`:tailwind`bg-[#FFF8EC]`]}>
      <SearchField
        navigation={navigation}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isDarkMode={isDarkMode}
      />
      {/* Hide history when searchValue is not empty */}
      {searchValue === '' && <SearchHistory setSearchValue={setSearchValue} isDarkMode={isDarkMode} />}
    </View>
  );
};

export default SearchScreen;
