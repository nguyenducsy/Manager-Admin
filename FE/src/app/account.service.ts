import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { delay, map, Observable, Subject } from 'rxjs';

import { User } from './shared/user.modal';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  userSubject = new Subject<User>();
  // rememberSubject = new Subject<User>();
  isLogin = new Subject<boolean>();

  urlApi = 'http://localhost:3000/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private router: Router) {}

  login(user: User): Observable<User> {
    return this.http.post<User>(
      `${this.urlApi}` + 'login',
      user,
      this.httpOptions
    );
  }

  signup(data: User): Observable<User> {
    return this.http.post<User>(
      `${this.urlApi}` + 'signup',
      data,
      this.httpOptions
    );
  }

  getInfor(name: string): Observable<User> {
    return this.http.get<User>(`${this.urlApi}` + 'profile/' + `${name}`);
  }

  updateInfo(name: string, data: User): Observable<User> {
    return this.http.post<User>(
      `${this.urlApi}` + 'profile/' + `${name}`,
      data,
      this.httpOptions
    );
  }

  logout() {
    this.isLogin.next(false);
    localStorage.setItem('isLogin', JSON.stringify(false));
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
