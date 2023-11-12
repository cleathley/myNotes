import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import merge from 'deepmerge';
import React, {ReactElement} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import axios from 'axios';
import {
  MD3DarkTheme as MaterialDarkTheme,
  MD3LightTheme as MaterialLightTheme,
  Provider as PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigationStackParamList} from './src/@types/navigation';
import {NoteProvider} from './src/context/Note';
import HomeScreen from './src/screens/Home';
import NoteScreen from './src/screens/Note';

// adapt the navigation themes from the paper themes
const {LightTheme, DarkTheme} = adaptNavigationTheme({
  reactNavigationLight: NavigationLightTheme,
  reactNavigationDark: NavigationDarkTheme,
});
// and merge everything together
const availableThemes = {
  combinedLightTheme: merge(MaterialLightTheme, LightTheme),
  combinedDarkTheme: merge(MaterialDarkTheme, DarkTheme),
};

const Stack = createNativeStackNavigator();

function App(): ReactElement {
  const navigationRef =
    useNavigationContainerRef<RootNavigationStackParamList>();

  // get the system colour scheme and use it as the default
  const colorScheme = useColorScheme() ?? 'light';
  const [isThemeDark] = React.useState(colorScheme === 'dark' ? true : false);

  let currentTheme = isThemeDark
    ? availableThemes.combinedDarkTheme
    : availableThemes.combinedLightTheme;

  // set the defaults for axios (as we are working with json)
  axios.defaults.headers.common.Accept = 'application/json';
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.timeout = 5000;

  return (
    <PaperProvider theme={currentTheme}>
      <StatusBar
        backgroundColor={currentTheme.colors.card}
        barStyle={isThemeDark ? 'light-content' : 'dark-content'}
      />
      <SafeAreaProvider>
        <NoteProvider>
          <NavigationContainer ref={navigationRef} theme={currentTheme}>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  title: 'myNotes',
                }}
              />
              <Stack.Screen
                name="Note"
                component={NoteScreen}
                options={{
                  title: '', // this is dynamically set
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NoteProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default App;
