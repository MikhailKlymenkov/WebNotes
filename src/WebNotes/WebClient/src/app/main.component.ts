import { Component, ViewChild } from '@angular/core';
import { NoteDto } from './dto/note.dto';
import { NotesService } from './services/api/notes.service';
import { Note } from './model/note';
import { NoteListItem } from './model/note-list-item';
import { NoteListComponent } from './note-list.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from './confirmation-popup.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  private readonly minTitleLength = 1;
  private readonly maxTitleLength = 50;

  @ViewChild(NoteListComponent, { static: false })
  private noteListComponent!: NoteListComponent;

  currentNote: Note = { id: 0, title: '', body: '', creationDate: undefined, isEdited: false };
  titleInvalid: boolean = false;
  editorState: string = '';
  isNotesColumnVisible = false;

  constructor(private notesService: NotesService, private dialog: MatDialog) { }

  onNoteClick(note: NoteListItem): void {
    if (this.noteListComponent.selectedItem === note || this.editorState !== '') {
      return;
    }

    if (!this.tryUnselectNoteListItem()) {
      return;
    }

    this.isNotesColumnVisible = false;
    this.currentNote = {
      id: note.id,
      title: note.title,
      body: '',
      creationDate: note.creationDate,
      isEdited: false
    };
    this.noteListComponent.selectedItem = note;

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

    if (!this.noteListComponent.selectedItem) {
      this.noteListComponent.addNewNote(this.currentNote.title);
    }
    else {
      this.noteListComponent.selectedItem.title = this.currentNote.title;
    }
  }

  onNewNoteClick(): void {
    if (!this.tryUnselectNoteListItem()) {
      return;
    }

    this.isNotesColumnVisible = false;
    this.currentNote = { id: 0, title: 'New note', body: '', creationDate: undefined, isEdited: false };
    this.noteListComponent.addNewNote(this.currentNote.title);
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
          this.currentNote.id = note.id;
          this.currentNote.creationDate = new Date(note.creationDate);
          this.noteListComponent.selectedItem!.id = this.currentNote.id;
          this.noteListComponent.selectedItem!.creationDate = this.currentNote.creationDate;
          this.editorState = '';
        });
      }
    }
  }

  onClearClick(): void {
    this.currentNote.body = '';
  }

  onDeleteClick(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { message: 'Are you sure you want to delete this note?' };
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let deleteNoteLocally = () => {
          this.currentNote = { id: 0, title: '', body: '', creationDate: undefined, isEdited: false };
          this.noteListComponent.deleteSelectedNote();
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
    });
  }

  toggleNotesColumn() {
    this.isNotesColumnVisible = !this.isNotesColumnVisible;
  }

  private tryUnselectNoteListItem(): boolean {
    if (this.noteListComponent.selectedItem) {
      this.titleInvalid = !this.isCurrentNoteValid();
      if (!this.titleInvalid) {
        this.noteListComponent.selectedItem = undefined;
      }

      return !this.titleInvalid;
    }

    return true;
  }

  private isCurrentNoteValid(): boolean {
    const titleLength = this.currentNote.title.trim().length;
    return titleLength >= this.minTitleLength && titleLength <= this.maxTitleLength;
  }
}
