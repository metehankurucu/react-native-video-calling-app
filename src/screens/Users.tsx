import React, {useContext} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {setItem} from '../helpers/AsyncStorage';
import {resetGo} from '../helpers/RootNavigation';
import {User} from '../interfaces';
import {UsersScreenNavigationProp} from '../interfaces/navigation';
import {MainContext} from '../store/MainProvider';

interface Props {
  navigation: UsersScreenNavigationProp;
}

const Users = ({navigation}: Props) => {
  const {users, username, call, reset, remoteUser, activeCall} = useContext(
    MainContext,
  );

  const callUser = (user: User) => {
    call(user);
    navigation.navigate('Call');
  };

  const onLogout = async () => {
    reset();
    await setItem('@username', null);
    resetGo('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Online Users</Text>
      {activeCall && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Call')}
          style={[styles.btn, {borderRadius: 0}]}>
          <Text style={styles.btnText}>
            Back to active call with {remoteUser?.username || ''}
          </Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={users}
        keyExtractor={(item) => item.username}
        renderItem={({item}) => {
          return (
            <View style={styles.card}>
              <Text style={styles.text}>{item.username}</Text>
              {username !== item.username ? (
                <TouchableOpacity
                  disabled={activeCall}
                  onPress={() => callUser(item)}
                  style={[styles.btn, {opacity: activeCall ? 0.3 : 1}]}>
                  <Text style={styles.btnText}>Call</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.text}>(me)</Text>
              )}
            </View>
          );
        }}
      />
      <TouchableOpacity onPress={onLogout}>
        <Text style={[styles.text, {textAlign: 'center'}]}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  card: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 0.6,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    color: '#333',
    margin: 12,
  },
  text: {
    fontSize: 22,
    margin: 5,
  },
  btn: {
    backgroundColor: '#341EFF',
    padding: 12,
    borderRadius: 99,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
});
