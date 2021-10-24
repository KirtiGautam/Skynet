import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  email = '';
  password = '';
  loading = true;

  onLogin = () => {
    const that = this;
    that.loading = true;
    console.log(that.email, that.password);
    that.email = '';
    that.password = '';
    that.loading = false;
  }
}
