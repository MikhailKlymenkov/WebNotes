import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoints } from '../../endpoints';
import { NoteDto } from '../../dto/note.dto';

@Injectable()
export class NotesService {
  constructor(private httpClient: HttpClient) { }

  getNotes(): Observable<any> {
    return this.httpClient.get<any>(`${Endpoints.API_URL}${Endpoints.NOTES}`);
  }

  getNote(id: number): Observable<any> {
    return this.httpClient.get<any>(`${Endpoints.API_URL}${Endpoints.NOTES}/${id}`);
  }

  addNote(noteDto: NoteDto): Observable<any> {
    return this.httpClient.post<any>(`${Endpoints.API_URL}${Endpoints.NOTES}`, noteDto);
  }

  editNote(id: number, noteDto: NoteDto): Observable<any> {
    return this.httpClient.put<any>(`${Endpoints.API_URL}${Endpoints.NOTES}/${id}`, noteDto);
  }

  deleteNote(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${Endpoints.API_URL}${Endpoints.NOTES}/${id}`);
  }
}
