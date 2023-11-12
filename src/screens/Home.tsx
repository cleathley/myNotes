import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {ReactElement} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Card, FAB, IconButton, Text} from 'react-native-paper';
import {RootNavigationStackParamList} from '../@types/navigation';
import {Note} from '../@types/note';
import {useNote} from '../context/Note';

export default function SplashScreen(): ReactElement {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationStackParamList>>();
  const notes = useNote();

  const Item = ({data}: {data: Note}) => (
    <Card
      mode="contained"
      style={styles.item}
      onPress={() => {
        navigation.navigate('Note', {note: data});
      }}>
      <Card.Title
        title={data.title}
        titleVariant="titleMedium"
        subtitle={data.body}
        subtitleVariant="bodyMedium"
        subtitleNumberOfLines={6}
        right={props => (
          <View style={styles.row}>
            <IconButton
              {...props}
              icon="note-edit"
              animated={true}
              onPress={() => {
                navigation.navigate('Note', {note: data});
              }}
            />
            <IconButton
              {...props}
              icon="note-remove"
              onPress={() => {
                notes.removeNote(data);
              }}
            />
          </View>
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.row, {paddingTop: 8}]}>
        <FlatList
          style={styles.faltList}
          data={notes.noteState.notes}
          renderItem={({item}) => <Item data={item} />}
          keyExtractor={(item: Note) => item.id}
          ListEmptyComponent={() => (
            <Card mode="contained" style={styles.item}>
              <Card.Content>
                <Text style={styles.centerAlign} variant="titleMedium">
                  No Notes
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      </View>
      <FAB
        mode="flat"
        icon="plus"
        style={styles.fab}
        onPress={() => {
          navigation.navigate('Note', {note: null});
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '100%',
  },
  faltList: {
    marginHorizontal: 8,
  },
  item: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  centerAlign: {
    justifyContent: 'center',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    borderRadius: 32,
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
