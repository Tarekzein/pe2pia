import React, {useState} from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Using Feather Icons
import { LinearGradient } from 'react-native-linear-gradient'; // Import LinearGradient
import tailwind from 'twrnc';


interface SearchHistoryProps {
  setSearchValue: (value: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ setSearchValue }) => {
  const [history, setHistory] = useState<string[]>([
    'Search Query 1',
    'Search Query 2',
    'Search Query 3',
    'Search Query 4',
    'Search Query 5',
  ]);

  return (
    <LinearGradient
      colors={['rgba(254, 203, 125, 0.16)', 'rgba(254, 203, 125, 0.08)']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={
        tailwind`p-5 rounded-lg dark:bg-gray-800 mt-3  dark:shadow-lg border rounded-5 border-gray-200 dark:border-gray-700`
      }
    >

      {/* Search Query Section */}
      {history.map((query, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSearchValue(query)} // Populate search field with clicked history
            style={tailwind`flex flex-row mb-3 items-center`}
          >
            <Icon name="clock" size={25} style={tailwind`text-[#FFB300] mr-5 dark:text-gray-400`} />
            <Text style={tailwind`text-lg text-gray-900 dark:text-white`}>{query}</Text>
          </TouchableOpacity>
      ))}

      {/* Search Query Section */}

    </LinearGradient>
  );
};

export default SearchHistory;