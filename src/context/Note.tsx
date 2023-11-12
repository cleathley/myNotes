// NoteContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {
  Note,
  NoteAction,
  NoteContextType,
  NoteProviderProps,
  NoteState,
} from '../@types/note';

// Create the NoteContext
//
const NoteContext = createContext<NoteContextType | undefined>(undefined);

// Create a custom hook for using the NoteContext in our components
//
const useNote = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNote must be used within a NoteProvider');
  }
  return context;
};

// Create the noteReducer to handle the dispatch methods from the app
//
const noteReducer = (state: NoteState, action: NoteAction): NoteState => {
  switch (action.type) {
    // restore the state
    case 'RESTORE_STATE':
      return action.payload;

    // add the item (in action payload) to the note. If it alreadt exists increase the quantity
    case 'ADD_NOTE':
      const existingItemIndex = state.notes.findIndex(
        note => note.id === action.payload.id,
      );
      if (existingItemIndex !== -1) {
        const updatedNoteItems = [...state.notes];
        updatedNoteItems[existingItemIndex].client = action.payload.client;
        updatedNoteItems[existingItemIndex].category = action.payload.category;
        updatedNoteItems[existingItemIndex].title = action.payload.title;
        updatedNoteItems[existingItemIndex].body = action.payload.body;

        return {...state, notes: updatedNoteItems};
      } else {
        return {
          ...state,
          notes: [...state.notes, {...action.payload}],
        };
      }

    // remove the item (in action payload) from the note (this removed it completly and
    // dosn't reduce the quantity)
    case 'REMOVE_NOTE':
      const updatedNoteItems = state.notes.filter(
        note => note.id !== action.payload.id,
      );
      return {...state, notes: updatedNoteItems};

    default:
      return state;
  }
};

// Create the Provider so we can wrap the dom and allow any element to access the
// note and provide some helper funtions
//
const NoteProvider = ({children}: NoteProviderProps) => {
  const [noteState, dispatch] = useReducer(noteReducer, {notes: []});

  // methods available
  const restoreState = (state: NoteState): void => {
    dispatch({type: 'RESTORE_STATE', payload: state});
  };

  const addNote = (note: Note): void => {
    dispatch({type: 'ADD_NOTE', payload: note});
  };

  const removeNote = (note: Note): void => {
    dispatch({type: 'REMOVE_NOTE', payload: note});
  };

  useEffect(() => {
    AsyncStorage.setItem('STORAGE_NOTE_STATE', JSON.stringify(noteState));
  }, [noteState]);

  useEffect(() => {
    AsyncStorage.getItem('STORAGE_NOTE_STATE').then(value => {
      if (value) {
        restoreState(JSON.parse(value));
      }
    });
  }, []);

  return (
    <NoteContext.Provider
      value={{
        noteState,
        dispatch,
        restoreState,
        addNote,
        removeNote,
      }}>
      {children}
    </NoteContext.Provider>
  );
};

export {NoteProvider, useNote};
