import {StackNavigationProp} from '@react-navigation/stack';

export type Routes = 'Home' | 'Users' | 'Call' | 'Entrance';

export type RootStackParamList = {
  Entrance: undefined;
  Home: undefined;
  Users: undefined;
  Call: undefined;
};

export type EntranceScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Entrance'
>;

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;
export type UsersScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Users'
>;
export type CallScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Call'
>;
