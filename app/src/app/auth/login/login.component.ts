import { UserService } from './../../../core/services/user.service';
import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { AuthService } from '../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private userService: UserService,
    private snackbar: MatSnackBar
  ) {}

  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });
  loading = false;
  hide = true;

  onLogin = () => {
    const that = this;
    that.loading = true;
    if (that.loginForm.valid) {
      that.authService
        .login(that.loginForm.value.username, that.loginForm.value.password)
        .subscribe(
          (res) => {
            that.authService.store(res);
            that.snackbar.open('Login Successful!!');
            that.userService.getUser().subscribe((user) => {
              that.storageService.set('user', user);
              that.router.navigate(['/']);
            });
          },
          (error) => {
            that.snackbar.open('Invalid Credentials');
            that.loading = false;
          }
        );
      that.loginForm.reset();
    }
    that.loading = false;
  };

  ngOnInit(): void {
    const that = this;
    if (that.authService.isLoggedIn()) {
      that.router.navigate(['/']);
    }
  }
}
