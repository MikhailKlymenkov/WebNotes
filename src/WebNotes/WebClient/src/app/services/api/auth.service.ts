import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from '../../endpoints';

@Injectable()
export class AuthService {
  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string) {
    const userDTO = { username, password };
    return this.httpClient.post<any>(`${Endpoints.API_URL}${Endpoints.LOGIN}`, userDTO);
  }

  register(username: string, password: string) {
    const userDTO = { username, password };
    return this.httpClient.post<any>(`${Endpoints.API_URL}${Endpoints.REGISTER}`, userDTO);
  }
}
