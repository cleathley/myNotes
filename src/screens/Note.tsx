import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import axios from 'axios';
import React, {ReactElement, useEffect, useState} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import {Button, HelperText, TextInput} from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import {
  NoteScreenRouteProp,
  RootNavigationStackParamList,
} from '../@types/navigation';
import {Note, NoteForm} from '../@types/note';
import {useNote} from '../context/Note';

const clientList = require('../constants/clients.json');
const categoryList = require('../constants/categories.json');

export default function NoteScreen(): ReactElement {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationStackParamList>>();
  const route = useRoute<NoteScreenRouteProp>();
  const notes = useNote();

  const [showClientDropDown, setShowClientDropDown] = useState(false);
  const [showCategoryDropDown, setShowCategoryDropDown] = useState(false);

  // get the note passed into from the navigation params (which can be null)
  const {note} = route.params;

  const {
    setValue,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<NoteForm>();

  // on load, set the screen title depending if we are creating a new note or editing an existing one.
  useEffect(() => {
    navigation.setOptions({
      title: note ? 'Edit note' : 'Create a new note',
      headerBackTitleVisible: false,
    });

    // set the form defaults to the values in the note passed in
    if (note !== null) {
      setValue('client', note.client);
      setValue('category', note.category);
      setValue('title', note.title);
      setValue('body', note.body);
    }
  }, [navigation, note, setValue]);

  const onSubmit: SubmitHandler<NoteForm> = async formData => {
    // dismiss any keyboard inputs left open
    Keyboard.dismiss();

    // copy the form data over to a new note instance
    const newOrUpdatedNote: Note = {
      // if we are updating a note, copy it's id else generate a new one (iffy at best LOL)
      id: note ? note.id : Math.random().toString(16).slice(2),
      client: formData.client,
      category: formData.category,
      title: formData.title,
      body: formData.body,
    };

    // add/update the note to the note provider
    notes.addNote(newOrUpdatedNote);

    // return home
    navigation.popToTop();
  };

  // populate the note with some random data
  async function onTest() {
    setValue(
      'client',
      clientList[randomNumberInRange(0, clientList.length)].value,
    );
    setValue(
      'category',
      categoryList[randomNumberInRange(0, categoryList.length)].value,
    );

    const rnd = '&r=' + Math.random();
    axios
      .get(
        'https://asdfast.beobit.net/api/?type=word&length=' +
          randomNumberInRange(3, 6) +
          rnd,
      )
      .then(response => {
        setValue('title', response.data.text);
      });

    axios
      .get('https://asdfast.beobit.net/api/?length=1' + rnd)
      .then(response => {
        setValue('body', response.data.text);
      });
  }

  function randomNumberInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{paddingTop: 8}} />

        <View style={styles.textInput}>
          <Controller
            name="client"
            control={control}
            rules={{
              required: 'Please select the client.',
            }}
            render={({field: {value}}) => (
              <DropDown
                label={'Client'}
                mode={'outlined'}
                visible={showClientDropDown}
                showDropDown={() => setShowClientDropDown(true)}
                onDismiss={() => setShowClientDropDown(false)}
                value={value}
                setValue={_value => setValue('client', _value)}
                list={clientList}
              />
            )}
          />
          {errors.client && (
            <HelperText type="error">{errors.client.message}</HelperText>
          )}
        </View>

        <View style={styles.textInput}>
          <Controller
            name="category"
            control={control}
            rules={{
              required: 'Please select the client.',
            }}
            render={({field: {value}}) => (
              <DropDown
                label={'Category'}
                mode={'outlined'}
                visible={showCategoryDropDown}
                showDropDown={() => setShowCategoryDropDown(true)}
                onDismiss={() => setShowCategoryDropDown(false)}
                value={value}
                setValue={_value => setValue('category', _value)}
                list={categoryList}
              />
            )}
          />
          {errors.category && (
            <HelperText type="error" style={styles.textInputErrorComboBox}>
              {errors.category.message}
            </HelperText>
          )}
        </View>

        <>
          <Controller
            name="title"
            control={control}
            rules={{
              required: 'Please enter in the note title.',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label="Title"
                mode="outlined"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                maxLength={60}
                autoCapitalize="none"
                error={errors.title as unknown as boolean}
                style={styles.textInput}
              />
            )}
          />
          {errors.title && (
            <HelperText type="error" style={styles.textInputError}>
              {errors.title.message}
            </HelperText>
          )}
        </>

        <>
          <Controller
            name="body"
            control={control}
            rules={{
              required: 'Please enter in the note text.',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label="Body"
                mode="outlined"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                multiline={true}
                numberOfLines={6}
                autoCapitalize="none"
                error={errors.body as unknown as boolean}
                style={styles.textInput}
              />
            )}
          />
          {errors.body && (
            <HelperText type="error" style={styles.textInputError}>
              {errors.body.message}
            </HelperText>
          )}
        </>

        <View style={styles.row}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={handleSubmit(onSubmit, Keyboard.dismiss)}>
            Save Note
          </Button>
        </View>

        <View style={[styles.row, {justifyContent: 'flex-end'}]}>
          <Button
            icon="bug-check"
            mode="elevated"
            style={{
              width: '50%',
            }}
            onPress={onTest}>
            Random data
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  textInput: {
    width: '100%',
    marginBottom: 16,
  },
  textInputError: {
    width: '90%',
    marginTop: -16,
    marginBottom: 16,
  },
  textInputErrorComboBox: {
    width: '90%',
  },
  button: {
    width: '100%',
  },
});
