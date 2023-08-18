import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { NoteListItem } from './model/note-list-item';
import { NotesService } from './services/api/notes.service';

@Component({
  selector: 'note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit {
  notes: NoteListItem[] | undefined;
  selectedItem: NoteListItem | undefined;
  @Output() noteClicked = new EventEmitter<NoteListItem>();

  constructor(private notesService: NotesService) { }

  ngOnInit(): void {
    this.getNotes();
  }

  addNewNote(title: string): void {
    if (this.notes === undefined) {
      return;
    }

    const newNote: NoteListItem = {
      id: 0,
      title: title,
      creationDate: undefined
    };

    this.notes.unshift(newNote);
    this.selectedItem = newNote;
  }

  deleteSelectedNote(): void {
    if (this.notes === undefined || this.selectedItem === undefined) {
      return;
    }

    this.notes.splice(this.notes.indexOf(this.selectedItem), 1);
    this.selectedItem = undefined;
  }

  private getNotes(): void {
    this.notesService.getNotes().subscribe(notes => {
      this.notes = notes.map((note: { id: number, title: string, creationDate: string }) => <NoteListItem>{
        id: note.id,
        title: note.title,
        creationDate: new Date(note.creationDate)
      });
      this.notes!.sort((a: NoteListItem, b: NoteListItem) => {
        return b.creationDate!.getTime() - a.creationDate!.getTime();
      });
    });
  }
}
