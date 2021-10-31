import { Token } from './../models/token.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private storageService: StorageService,
    private apiService: ApiService
  ) {}

  login(userName: string, password: string): Observable<Token> {
    return this.apiService.post('users/login', { userName, password });
  }

  signup(userName: string, password: string): Observable<any> {
    return this.apiService.post('users/register', { userName, password });
  }

  store(data: Token) {
    this.storageService.set('access_token', data.accessToken);
    this.storageService.set('refresh_token', data.refreshToken);
  }

  isLoggedIn() {
    return this.storageService.get('access_token') !== null;
  }

  getUser() {
    return this.storageService.get('user');
  }

  logout() {
    this.storageService.clear();
  }
}
