import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import tailwind from 'twrnc';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../../../../context/ThemeContext';
import { useAuth } from '../../../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import Toast from 'react-native-toast-message';

// 1) Import Formik and Yup
import { Formik } from 'formik';
import * as Yup from 'yup';

// Validation schema for the form
const EditProfileSchema = Yup.object().shape({
  FirstName: Yup.string().required('First Name is required'),
  LastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

interface EditProfileScreenProps {
  navigation: any;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { user } = useAuth();
  const { loading,updateProfile } = useProfile();
  const initialValues = {
    FirstName: user?.FirstName || '',
    LastName: user?.LastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
  };

  const handleFormSubmit = (values: typeof initialValues) => {
    try {
      console.log('Submitting form:', values);
      updateProfile(values);
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully',
      });
      navigation.goBack();
    }catch (error) {
      console.log('Error updating profile:', error);
    }
  };

  return (
    <View
      style={
        isDarkMode
          ? tailwind`flex-1 bg-gray-800`
          : tailwind`flex-1 bg-[#FFF8EC]`
      }
    >
      {/* Header */}
      <View style={tailwind`flex-row relative items-center mt-10 mx-5`}>
        <Icon
          name="arrow-left"
          style={tailwind`absolute`}
          size={30}
          color={isDarkMode ? '#fff' : '#00347D'}
          onPress={() => navigation.goBack()}
        />
        <Text
          style={[
            tailwind`text-2xl font-bold mx-auto`,
            { color: '#FEA928' },
          ]}
        >
          Edit Profile
        </Text>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={EditProfileSchema}
        onSubmit={handleFormSubmit}
      >
        {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={tailwind`flex-1`}
          >
            {/* Avatar + Camera Icon */}
            <View style={tailwind`items-center mt-6`}>
              <View style={tailwind`w-24 h-24 rounded-full bg-gray-300 justify-center items-center`}>
                <Image
                  source={{ uri: user?.profilePicture?.url }}
                  style={tailwind`w-24 h-24 rounded-full`}
                />
              </View>
              <TouchableOpacity
                style={tailwind`absolute bottom-0 right-28 bg-[#FEA928] p-2 rounded-full`}
                onPress={() => {
                  console.log('Change avatar');
                }}
              >
                <FontAwesome5 name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={tailwind`px-6 mt-6`}>
              {/* First Name */}
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
                <Text style={tailwind`text-red-500 text-sm`}>{errors.FirstName}</Text>
              )}

              {/* Last Name */}
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
                <Text style={tailwind`text-red-500 text-sm`}>{errors.LastName}</Text>
              )}

              {/* Email */}
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
                <Text style={tailwind`text-red-500 text-sm`}>{errors.email}</Text>
              )}

              {/* Bio (Multiline) */}
              <TextInput
                style={[
                  tailwind`border-2 text-base p-2 mb-2 mt-4 rounded`,
                  {
                    borderColor: isDarkMode ? '#FEA928' : '#00347D',
                    color: isDarkMode ? '#fff' : '#00347D',
                    textAlignVertical: 'top', // Ensures text starts at the top on Android
                    height: 120, // Increase height for a larger text area
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
                <Text style={tailwind`text-red-500 text-sm`}>{errors.bio}</Text>
              )}
            </View>

            {/* Save Changes Button */}
            <View style={tailwind`px-6 mt-8`}>
              <TouchableOpacity
                style={[
                  tailwind`rounded-full py-3 items-center flex-row justify-center`,
                  { backgroundColor: loading ? '#888' : '#00347D' }, // Change color when loading
                ]}
                onPress={handleSubmit as any}
                disabled={loading} // Disable button when loading
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
    </View>
  );
};

export default EditProfileScreen;
