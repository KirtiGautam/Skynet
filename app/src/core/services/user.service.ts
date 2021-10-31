import { User } from './../models/user.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUser(): Observable<User> {
    return this.apiService.get('users', {});
  }
}
