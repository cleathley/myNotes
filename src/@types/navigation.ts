import {RouteProp} from '@react-navigation/native';
import {Note} from './note';

export type RootNavigationStackParamList = {
  // individual screens
  Home: undefined;
  Note: {note: Note | null};
};

// export the individual screen props (built from the above list)
export type NoteScreenRouteProp = RouteProp<
  RootNavigationStackParamList,
  'Note'
>;
