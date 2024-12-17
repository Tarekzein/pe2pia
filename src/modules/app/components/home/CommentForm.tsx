import { TextInput, TouchableOpacity, View } from "react-native";
import tailwind from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { useHome } from "../../context/HomeContext";

interface CommentFormProps {
    isDarkMode: boolean;
    postId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ isDarkMode, postId }) => {
    const [comment, setComment] = React.useState<string>('');
    const { addComment } = useHome();

    const handleComment = () => {
        if (comment.trim()) {
            addComment(postId, comment);
            setComment('');
        }
    };

    const isDisabled = comment.trim() === '';

    return (
        <View
            style={[
                tailwind`flex-row items-center pt-3 border-t`,
                isDarkMode
                    ? tailwind`border-gray-700 bg-gray-800`
                    : tailwind`border-gray-300`,
            ]}
        >
            <TouchableOpacity style={tailwind`mx-2`}>
                <Icon name="attachment" size={30} color={"#FEA928"} />
            </TouchableOpacity>
            <TextInput
                style={[
                    tailwind`flex-1 h-10 rounded-full px-4 text-sm`,
                    isDarkMode
                        ? tailwind`bg-gray-700 text-white`
                        : tailwind`bg-gray-200 text-gray-800`,
                ]}
                placeholder="Comment on this post"
                placeholderTextColor="#9CA3AF"
                value={comment}
                onChangeText={setComment}
            />
            <TouchableOpacity
                onPress={handleComment}
                disabled={isDisabled}
                activeOpacity={0.5}
                style={[
                    tailwind`ml-2`,
                    isDisabled && tailwind`opacity-50`, // Visually indicate the button is disabled
                ]}
            >
                <Icon
                    name="send"
                    size={30}
                    color={isDisabled ? "#A3A3A3" : "#FEA928"} // Change color if disabled
                />
            </TouchableOpacity>
        </View>
    );
};

export default CommentForm;
