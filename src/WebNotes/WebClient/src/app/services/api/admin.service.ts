import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from '../../endpoints';
import { Observable } from 'rxjs';

@Injectable()
export class AdminService {
  constructor(private httpClient: HttpClient) { }

  getStatistic(): Observable<any> {
    return this.httpClient.get(`${Endpoints.API_URL}${Endpoints.STATISTIC}`);
  }

  deleteAccount(username: string): Observable<any> {
    return this.httpClient.delete(`${Endpoints.API_URL}${Endpoints.DELETE_ACCOUNT}/${username}`);
  }
}
