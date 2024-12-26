import {Image, Text, View} from 'react-native';
import tailwind from "twrnc";
import React from "react";
import {formatTimeAgo} from '../../helpers/timeFunctions.ts';
interface CommentCardProps {
    comment: any;
    isDarkMode: boolean;
}

const CommentCard:React.FC<CommentCardProps> = ({ comment,isDarkMode }) => {
    return (
        <View style={tailwind`flex-row items-start my-5`}>
            <Image source={{ uri: comment.user.profilePicture?.url }} style={tailwind`w-10 h-10 rounded-full`} />
            <View style={tailwind`ml-3 w-auto`}>
                <Text style={tailwind`text-${isDarkMode? 'white' : 'gray-800' } font-semibold`}>{comment.username}</Text>
                <View
                style={[
                tailwind` rounded-xl mb-1 bg-${ isDarkMode ? 'gray-600' : 'gray-300'} p-4 mt-3`,
                ]}
                >
                    <Text style={tailwind`text-${isDarkMode? 'gray-300' : 'gray-800' }`}>{comment.text}</Text>
                </View>
                <View style={tailwind`flex-row justify-between items-center mt-3`}>
                    <Text style={tailwind`text-gray-500`}>{formatTimeAgo(comment.createdAt)}</Text>
                    {/*<Text style={tailwind`text-gray-500 mx-3`}>Like</Text>*/}
                    {/*<Text style={tailwind`text-gray-500`}>Reply</Text>*/}
                </View>
            </View>
        </View>
    );
}

export default CommentCard;