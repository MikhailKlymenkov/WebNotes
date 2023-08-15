import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from '../../endpoints';
import { UserDto } from '../../dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private httpClient: HttpClient) { }

  login(userDTO: UserDto) {
    return this.httpClient.post<any>(`${Endpoints.API_URL}${Endpoints.LOGIN}`, userDTO);
  }

  register(userDTO: UserDto) {
    return this.httpClient.post<any>(`${Endpoints.API_URL}${Endpoints.REGISTER}`, userDTO);
  }
}
