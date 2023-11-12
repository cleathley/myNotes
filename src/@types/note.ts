export type Notes = Array<Note>;

export type Note = {
  id: string;
  client: string;
  category: string;
  title: string;
  body: string;
};

export type NoteForm = {
  client: string;
  category: string;
  title: string;
  body: string;
};

export type NoteState = {
  notes: Notes;
};

export type NoteAction =
  | {type: 'RESTORE_STATE'; payload: NoteState}
  | {type: 'ADD_NOTE'; payload: Note}
  | {type: 'REMOVE_NOTE'; payload: Note};

export type NoteContextType = {
  // from the reducer
  noteState: NoteState;
  dispatch: React.Dispatch<NoteAction>;
  // methods of the context provider
  restoreState(state: any): void;
  addNote(note: Note): void;
  removeNote(item: Note): void;
};

export type NoteProviderProps = {
  children: React.ReactNode;
};
