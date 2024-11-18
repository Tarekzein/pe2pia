import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../../../core/theme';
import { passwordValidator } from '../helpers/passwordValidator';
import { useAuth } from '../../../hooks/AuthProvider';

export default function ResetPasswordScreen({ navigation }) {
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });
  const { resetPassword,forgotPasswordEmail,error } = useAuth();

  const onResetPasswordPressed = () => {
    const passwordError = passwordValidator(password.value);
    const confirmPasswordError = password.value !== confirmPassword.value ? "Passwords do not match" : '';

    if (passwordError || confirmPasswordError) {
      setPassword({ ...password, error: passwordError });
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
      return;
    }

    resetPassword(forgotPasswordEmail, password.value, confirmPassword.value);
    if (error) {
      setPassword({ ...password, error: error });
      setConfirmPassword({ ...confirmPassword, error: error });
      return;
    }
    navigation.navigate('LoginScreen');
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Reset Password</Header>
      <TextInput
        label="New Password"
        returnKeyType="next"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <TextInput
        label="Confirm Password"
        returnKeyType="done"
        value={confirmPassword.value}
        onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
        error={!!confirmPassword.error}
        errorText={confirmPassword.error}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onResetPasswordPressed}
        style={{ marginTop: 24 }}
      >
        Reset Password
      </Button>
      <View style={styles.row}>
        <Text>Remembered your password? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});
