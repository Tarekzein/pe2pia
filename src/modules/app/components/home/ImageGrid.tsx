import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';

const ImageGrid = ({ files, onPostClick }: { files: any[], onPostClick?: () => void;  }) => {
    const maxDisplay = 4; // Maximum images to display before showing "+X"

    return (
        <TouchableOpacity onPress={onPostClick}>

        <View style={[tailwind`mt-4 flex-row flex-wrap justify-evenly`]}>
            {files.slice(0, maxDisplay).map((file, index) => (
                <View
                    key={index}
                    style={[
                        tailwind`overflow-hidden rounded-lg mb-2`,
                        { width: files.length === 1 ? '100%' : '48%', height: 150 }, // Adjust size for single or grid layout
                    ]}
                >
                    <Image
                        source={{ uri: file.url }}
                        style={tailwind`w-full h-full rounded-lg`}
                        resizeMode="cover"
                    />
                    {index === maxDisplay - 1 && files.length > maxDisplay && (
                        <TouchableOpacity
                            style={[
                                tailwind`absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center rounded-lg`,
                            ]}
                            onPress={onPostClick}
                        >
                            <Text style={tailwind`text-white text-lg font-bold`}>+{files.length - maxDisplay}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </View>
        </TouchableOpacity>
    );
};

export default ImageGrid;
