import { User } from './../../core/models/user.model';
import { StorageService } from './../../core/services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from './../../core/services/auth.service';
import { ApiService } from './../../core/services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  user: User;
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    private storageService: StorageService
  ) {
    this.user = this.storageService.get('user');
  }

  logout() {
    this.authService.logout();
    this.snackbar.open('Logged off!');
    this.router.navigate(['/auth/login']);
  }

  ngOnInit(): void {}
}
