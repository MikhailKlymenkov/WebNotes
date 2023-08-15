import { Component, OnInit } from '@angular/core';
import { NoteDto } from './dto/note.dto';
import { NotesService } from './services/api/notes.service';
import { Note } from './model/note';
import { NoteListItem } from './model/note-list-item';

@Component({
  selector: 'note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit {
  private readonly minTitleLength = 1;
  private readonly maxTitleLength = 50;

  listLoading: boolean = true;
  editorState: string = '';
  notes: NoteListItem[] = [];
  selectedNoteListItem: NoteListItem | undefined;
  currentNote: Note = { id: 0, title: '', body: '', creationDate: undefined, isEdited: false };
  titleInvalid: boolean = false;

  constructor(private notesService: NotesService) { }

  ngOnInit(): void {
    this.getNotes();
  }

  getNotes(): void {
    this.notesService.getNotes().subscribe(notes => {
      this.notes = notes.map((note: { id: number, title: string, creationDate: string }) => <NoteListItem>{
        id: note.id,
        title: note.title,
        creationDate: new Date(note.creationDate),
        isSelected: false
      });
      this.notes.sort((a: NoteListItem, b: NoteListItem) => {
        return b.creationDate!.getTime() - a.creationDate!.getTime();
      });
      this.listLoading = false;
    });
  }

  onNoteClick(note: NoteListItem): void {
    if (this.selectedNoteListItem === note) {
      return;
    }

    if (!this.tryUnselectNoteListItem()) {
      return;
    }

    this.currentNote = {
      id: note.id,
      title: note.title,
      body: '',
      creationDate: note.creationDate,
      isEdited: false
    };
    note.isSelected = true;
    this.selectedNoteListItem = note;

    if (this.currentNote.creationDate) {
      this.editorState = "Loading...";
      this.notesService.getNote(note.id).subscribe(note => {
        this.currentNote = {
          id: note.id,
          title: note.title,
          body: note.body,
          creationDate: new Date(note.creationDate),
          isEdited: note.isEdited
        };
        this.editorState = '';
      });
    }
  }

  onTitleInput(): void {
    this.titleInvalid = false;

    if (!this.selectedNoteListItem) {
      this.addNewNoteToList();
    }
    else {
      this.selectedNoteListItem.title = this.currentNote.title;
    }
  }

  onNewNoteClick(): void {
    if (!this.tryUnselectNoteListItem()) {
      return;
    }

    this.currentNote = { id: 0, title: 'New note', body: '', creationDate: undefined, isEdited: false };
    this.addNewNoteToList();
  }

  onSaveClick(): void {
    this.titleInvalid = !this.isCurrentNoteValid();
    if (!this.titleInvalid) {
      this.editorState = "Saving...";
      const noteDto: NoteDto = { title: this.currentNote.title, body: this.currentNote.body };

      // Edit
      if (this.currentNote.creationDate) {
        this.notesService.editNote(this.currentNote.id, noteDto).subscribe(() => {
          this.currentNote.isEdited = true;
          this.editorState = '';
        });
      }
      // Add
      else {
        this.notesService.addNote(noteDto).subscribe(note => {
          this.selectedNoteListItem!.id = note.id;
          this.selectedNoteListItem!.creationDate = note.creationDate;
          this.currentNote.id = note.id;
          this.currentNote.creationDate = new Date(note.creationDate);
          this.editorState = '';
        });
      }
    }
  }

  onClearClick(): void {
    this.currentNote.body = '';
  }

  onDeleteClick(): void {
    let deleteNoteLocally = () => {
      this.currentNote = { id: 0, title: '', body: '', creationDate: undefined, isEdited: false };
      this.notes.splice(this.notes.indexOf(this.selectedNoteListItem!), 1);
      this.selectedNoteListItem = undefined;
      this.titleInvalid = false;
      this.editorState = '';
    }

    if (this.currentNote.creationDate) {
      this.editorState = "Deleting...";
      this.notesService.deleteNote(this.currentNote.id).subscribe(() => {
        deleteNoteLocally();
      });
    }
    else {
      deleteNoteLocally();
    }
  }

  addNewNoteToList(): void {
    const newNote: NoteListItem = {
      id: 0,
      title: this.currentNote.title,
      creationDate: undefined,
      isSelected: true
    };

    this.notes.unshift(newNote);
    this.selectedNoteListItem = newNote;
  }

  tryUnselectNoteListItem(): boolean {
    if (this.selectedNoteListItem) {
      this.titleInvalid = !this.isCurrentNoteValid();
      if (!this.titleInvalid) {
        this.selectedNoteListItem.isSelected = false;
      }

      return !this.titleInvalid;
    }

    return true;
  }

  isCurrentNoteValid(): boolean {
    const titleLength = this.currentNote.title.trim().length;
    return titleLength >= this.minTitleLength && titleLength <= this.maxTitleLength;
  }
}
