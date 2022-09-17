import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { User } from '../shared/user.modal';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userDataSession!: User;
  userDataLocal!: User;
  userName!: string;
  firstName!: string;
  lastName!: string;
  isLogin = false;

  constructor(private account: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.account.isLogin.next(JSON.parse(localStorage.getItem('isLogin')!));
    this.account.isLogin.subscribe({
      next: (res) => (this.isLogin = res),
    });
    this.account.userSubject.subscribe({
      next: (res) => {
        this.userDataSession = res;
        this.isLogin = true;
        const { username, firstName, lastName } = this.userDataSession;
        this.userName = username;
        this.firstName = firstName;
        this.lastName = lastName;
      },
      error: (err) => console.log(err),
    });
    this.userDataSession = JSON.parse(sessionStorage.getItem('user')!);
    this.userDataLocal = JSON.parse(localStorage.getItem('user')!);

    if (this.userDataSession || JSON.parse(localStorage.getItem('isLogin')!) == true) {
      this.isLogin = true;
      const { username, firstName, lastName } =
        this.userDataSession || this.userDataLocal;
      this.userName = username;
      this.firstName = firstName;
      this.lastName = lastName;
    } else {
      this.isLogin = false;
    }
  }

  btnLogout() {
    if (this.isLogin) {
      this.account.logout();
      this.isLogin = false;
    } else this.router.navigate(['/register']);
  }
}
