import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext'; // Adjust the path as necessary
import store, { persistor } from './src/modules/store';
import Toast from 'react-native-toast-message';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AuthProvider>
            <AppNavigator />
            <Toast  />
          </AuthProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
