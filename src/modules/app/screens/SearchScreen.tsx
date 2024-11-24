import React, { useState } from 'react';
import { View } from 'react-native';
import tailwind from 'twrnc';
import SearchField from '../components/search/SearchField';
import SearchHistory from '../components/search/SearchHistory';

interface HomeScreenProps {
  navigation: any;
}

const SearchScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState(''); // State to manage input value

  return (
    <View style={tailwind`bg-[#FFF8EC] h-full p-5 pb-25`}>
      <SearchField
        navigation={navigation}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      {/* Hide history when searchValue is not empty */}
      {searchValue === '' && <SearchHistory setSearchValue={setSearchValue} />}
    </View>
  );
};

export default SearchScreen;
