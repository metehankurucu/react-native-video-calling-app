import React, {useContext} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {setItem} from '../helpers/AsyncStorage';
import {HomeScreenNavigationProp} from '../interfaces/navigation';
import {MainContext} from '../store/MainProvider';

interface Props {
  navigation: HomeScreenNavigationProp;
}

const Home = ({navigation}: Props) => {
  const {username, setUsername, initialize} = useContext(MainContext);

  const onEnter = async () => {
    if (username.length < 6) {
      Alert.alert('Username must be at least 6 characters');
      return;
    }
    initialize();
    await setItem('@username', username);
    navigation.navigate('Users');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Your Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TouchableOpacity onPress={onEnter} style={styles.btn}>
          <Text style={styles.btnText}>Enter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    width: '80%',
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    color: '#333',
    marginVertical: 8,
  },
  input: {
    borderRadius: 99,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderWidth: 0.7,
    borderColor: '#ddd',
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 18,
  },
  btn: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    backgroundColor: '#341EFF',
    marginVertical: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
  },
});
