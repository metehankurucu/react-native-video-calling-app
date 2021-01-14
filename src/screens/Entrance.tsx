import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {getItem} from '../helpers/AsyncStorage';
import {resetGo} from '../helpers/RootNavigation';
import {EntranceScreenNavigationProp} from '../interfaces/navigation';
import {MainContext} from '../store/MainProvider';

interface Props {
  navigation: EntranceScreenNavigationProp;
}

const Entrance = ({}: Props) => {
  const {username, setUsername, initialize} = useContext(MainContext);

  useEffect(() => {
    checkUsername();
  }, []);

  useEffect(() => {
    if (username) {
      initialize();
      resetGo('Users');
    }
  }, [username]);

  const checkUsername = async () => {
    const username = await getItem('@username');
    if (typeof username === 'string') {
      setUsername(username);
    } else {
      resetGo('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Video Call App</Text>
      <ActivityIndicator color="gray" />
    </View>
  );
};

export default Entrance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
  },
});
