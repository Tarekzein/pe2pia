import React, { useState } from 'react';
import { View } from 'react-native';
import tailwind from 'twrnc';
import SearchField from '../../components/search/SearchField.tsx';
import SearchHistory from '../../components/search/SearchHistory.tsx';
import {useTheme} from '../../../../context/ThemeContext.tsx';
import {useSearch} from "../../context/SearchContext.tsx";
import SearchResultsList from "../../components/search/SearchResultsList.tsx";

interface HomeScreenProps {
  navigation: any;
}

const SearchScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState(''); // State to manage input value
  const { theme } = useTheme();
  const { searchHistory,fetchSearch } = useSearch();
  const isDarkMode = theme === 'dark';
  const handleSearch = async (query: string) => {
    try {
      if (query.length >= 1){
        await fetchSearch(query);
      }
    } catch (err: any) {
      console.error(err);
    }
  }

  return (
    <View style={[tailwind` h-full p-5 pb-25`,isDarkMode ? tailwind`bg-gray-800` : tailwind`bg-[#FFF8EC]`]}>
      <SearchField
        navigation={navigation}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
        isDarkMode={isDarkMode}
      />
      {/* Hide history when searchValue is not empty */}
      {searchValue === '' && <SearchHistory handleSearch={handleSearch} setSearchValue={setSearchValue} isDarkMode={isDarkMode} />}
      {searchValue !== '' && <SearchResultsList />}
    </View>
  );
};

export default SearchScreen;
