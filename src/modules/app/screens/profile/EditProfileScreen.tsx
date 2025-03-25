import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,

} from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../../../../context/ThemeContext';
import { useAuth } from '../../../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';

// Gesture Handling
import {
  Gesture
} from 'react-native-gesture-handler';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

// Formik and Yup for validation
import { Formik } from 'formik';
import * as Yup from 'yup';
const CROP_SIZE = 300; // Consistent crop size

// Validation schema
const EditProfileSchema = Yup.object().shape({
  FirstName: Yup.string().required('First Name is required'),
  LastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  bio: Yup.string().max(500, 'Bio must be at most 500 characters'),
});

interface EditProfileScreenProps {
  navigation: any;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { user } = useAuth();
  const { loading, updateProfile } = useProfile();

  // Local State for Profile Picture
  const [selectedImage, setSelectedImage] = useState(user?.profilePicture?.url || '');
  const [isImageSelectionModalVisible, setImageSelectionModalVisible] = useState(false);

  // Gesture Values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Animated Styles
  useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value }
    ],
  }));
// Function to Open Camera
  const openCamera = useCallback(() => {
    ImagePicker.openCamera({
      width: CROP_SIZE,
      height: CROP_SIZE,
      cropping: true,
      cropperCircleOverlay: true,
      compressImageQuality: 0.8,
    }).then(image => {
      setSelectedImage(image.path);
      setImageSelectionModalVisible(false);
    }).catch(error => {
      console.log('Camera error:', error);
      Toast.show({
        type: 'error',
        text1: 'Camera Error',
        text2: 'Failed to take photo',
      });
    });
  }, []);

  // Function to Open Image Library
  const openImageLibrary = useCallback(() => {
    ImagePicker.openPicker({
      width: CROP_SIZE,
      height: CROP_SIZE,
      cropping: true,
      cropperCircleOverlay: true,
      compressImageQuality: 0.8,
    }).then(image => {
      setSelectedImage(image.path);
      setImageSelectionModalVisible(false);
    }).catch(error => {
      console.log('Image picker error:', error);
      Toast.show({
        type: 'error',
        text1: 'Image Selection Failed',
        text2: 'Unable to select image',
      });
    });
  }, []);


  // Pinch Gesture Handler
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withSpring(1);
    });

  // Pan Gesture Handler
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  // Combined Gesture
  Gesture.Simultaneous(
    pinchGesture,
    panGesture
  );
// Image Selection Modal
  const ImageSelectionModal = () => (
    <Modal
      isVisible={isImageSelectionModalVisible}
      swipeDirection={['down']}
      style={tailwind`justify-end m-0`}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      onBackdropPress={() => setImageSelectionModalVisible(false)}
      onSwipeComplete={() => setImageSelectionModalVisible(false)}
    >
      <View
        style={[
          tailwind`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6`,
          isDarkMode ? tailwind`bg-gray-800` : '',
          {
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }
        ]}
      >
        {/* Drag Handle */}
        <View
          style={[
            tailwind`self-center w-12 h-1 rounded-full mb-6`,
            isDarkMode ? tailwind`bg-gray-600` : tailwind`bg-gray-300`
          ]}
        />

        <Text
          style={[
            tailwind`text-lg font-bold mb-4`,
            isDarkMode ? tailwind`text-white` : tailwind`text-gray-800`
          ]}
        >
          Choose Profile Picture
        </Text>

        <TouchableOpacity
          style={tailwind`flex-row items-center py-4 border-b border-gray-200`}
          onPress={openCamera}
        >
          <Icon
            name="camera"
            size={24}
            color={isDarkMode ? '#FEA928' : '#00347D'}
            style={tailwind`mr-4`}
          />
          <Text
            style={[
              tailwind`text-base`,
              isDarkMode ? tailwind`text-white` : tailwind`text-gray-800`
            ]}
          >
            Take Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tailwind`flex-row items-center py-4`}
          onPress={openImageLibrary}
        >
          <Icon
            name="image"
            size={24}
            color={isDarkMode ? '#FEA928' : '#00347D'}
            style={tailwind`mr-4`}
          />
          <Text
            style={[
              tailwind`text-base`,
              isDarkMode ? tailwind`text-white` : tailwind`text-gray-800`
            ]}
          >
            Choose from Library
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tailwind`mt-4 py-4 items-center`}
          onPress={() => setImageSelectionModalVisible(false)}
        >
          <Text
            style={[
              tailwind`text-base font-bold`,
              isDarkMode ? tailwind`text-red-400` : tailwind`text-red-500`
            ]}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  // Function to Pick an Image
  const selectImage = useCallback(() => {
    setImageSelectionModalVisible(true);
  }, []);

  const initialValues = {
    FirstName: user?.FirstName || '',
    LastName: user?.LastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
  };

  const handleFormSubmit = (values: typeof initialValues) => {
    try {
      updateProfile({
        ...values,
        profilePicture: selectedImage
      });
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully',
      });
      navigation.goBack();
    } catch (error) {
      console.log('Error updating profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'There was an error updating your profile',
      });
    }
  };

  return (
    <View style={isDarkMode ? tailwind`flex-1 bg-gray-800` : tailwind`flex-1 bg-[#FFF8EC]`}>
      {/* Header */}
      <View style={tailwind`flex-row relative items-center mt-10 mx-5`}>
        <Icon
          name="arrow-left"
          style={tailwind`absolute`}
          size={30}
          color={isDarkMode ? '#fff' : '#00347D'}
          onPress={() => navigation.goBack()}
        />
        <Text style={[tailwind`text-2xl font-bold mx-auto`, { color: '#FEA928' }]}>
          Edit Profile
        </Text>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={EditProfileSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={tailwind`flex-1`}
          >
            {/* Avatar Section */}
            <View style={tailwind`items-center mt-6`}>
              <TouchableOpacity
                style={tailwind`w-24 h-24 rounded-full overflow-hidden`}
                onPress={selectImage}
              >
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={tailwind`w-full h-full`}
                  />
                ) : (
                  <View style={tailwind`w-full h-full bg-gray-300`} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={tailwind`absolute bottom-0 right-28 bg-[#FEA928] p-2 rounded-full`}
                onPress={selectImage}
              >
                <FontAwesome5 name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>


            {/* Form Fields */}
            <View style={tailwind`px-6 mt-6`}>
              {/* First Name Input */}
              <TextInput
                style={[
                  tailwind`border-b-2 text-base py-2 mb-2`,
                  {
                    borderColor: isDarkMode ? '#FEA928' : '#00347D',
                    color: isDarkMode ? '#fff' : '#00347D',
                  },
                ]}
                placeholder="First Name"
                placeholderTextColor={isDarkMode ? '#bbb' : '#999'}
                onChangeText={handleChange('FirstName')}
                onBlur={handleBlur('FirstName')}
                value={values.FirstName}
              />
              {errors.FirstName && touched.FirstName && (
                <Text style={tailwind`text-red-500 text-sm`}>
                  {errors.FirstName}
                </Text>
              )}

              {/* Last Name Input */}
              <TextInput
                style={[
                  tailwind`border-b-2 text-base py-2 mb-2`,
                  {
                    borderColor: isDarkMode ? '#FEA928' : '#00347D',
                    color: isDarkMode ? '#fff' : '#00347D',
                  },
                ]}
                placeholder="Last Name"
                placeholderTextColor={isDarkMode ? '#bbb' : '#999'}
                onChangeText={handleChange('LastName')}
                onBlur={handleBlur('LastName')}
                value={values.LastName}
              />
              {errors.LastName && touched.LastName && (
                <Text style={tailwind`text-red-500 text-sm`}>
                  {errors.LastName}
                </Text>
              )}

              {/* Email Input */}
              <TextInput
                style={[
                  tailwind`border-b-2 text-base py-2 mb-2 mt-4`,
                  {
                    borderColor: isDarkMode ? '#FEA928' : '#00347D',
                    color: isDarkMode ? '#fff' : '#00347D',
                  },
                ]}
                placeholder="Email"
                placeholderTextColor={isDarkMode ? '#bbb' : '#999'}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
              />
              {errors.email && touched.email && (
                <Text style={tailwind`text-red-500 text-sm`}>
                  {errors.email}
                </Text>
              )}

              {/* Bio Input */}
              <TextInput
                style={[
                  tailwind`border-2 text-base p-2 mb-2 mt-4 rounded`,
                  {
                    borderColor: isDarkMode ? '#FEA928' : '#00347D',
                    color: isDarkMode ? '#fff' : '#00347D',
                    textAlignVertical: 'top',
                    height: 120,
                  },
                ]}
                placeholder="Bio"
                placeholderTextColor={isDarkMode ? '#bbb' : '#999'}
                onChangeText={handleChange('bio')}
                onBlur={handleBlur('bio')}
                value={values.bio}
                multiline
                numberOfLines={4}
              />
              {errors.bio && touched.bio && (
                <Text style={tailwind`text-red-500 text-sm`}>
                  {errors.bio}
                </Text>
              )}
            </View>

            {/* Save Changes Button */}
            <View style={tailwind`px-6 mt-8`}>
              <TouchableOpacity
                style={[
                  tailwind`rounded-full py-3 items-center flex-row justify-center`,
                  { backgroundColor: loading ? '#888' : '#00347D' }
                ]}
                onPress={handleSubmit as any}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={tailwind`text-white text-lg font-bold`}>
                    Save changes
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </Formik>
      {/* Render Image Selection Modal */}
      {ImageSelectionModal()}
    </View>
  );
};

export default EditProfileScreen;
