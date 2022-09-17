import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { User } from '../shared/user.modal';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public showPassword!: boolean;
  value3!: string;
  info!: User;
  profileForm!: FormGroup;
  username: string = '';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: [],
      lastName: [],
      password: [],
      confirmpassword: [],
    });

    this.info = JSON.parse(
      sessionStorage.getItem('user') || localStorage.getItem('user')!
    );
    if (this.info != null) {
      this.accountService.getInfor(this.info.username).subscribe({
        next: (data) => {
          this.setValue(data);
        },
      });
    } else this.router.navigateByUrl('/');
  }

  setValue(value: User) {
    if (value.firstName != '' && value.lastName != '') {
      this.username = `${value.firstName} ${value.lastName}`;
    } else {
      this.username = value.username;
    }
    this.profileForm = this.fb.group({
      firstName: [value.firstName],
      lastName: [value.lastName],
      password: ['', Validators.required],
      confirmpassword: [],
    });
  }

  saveChanges() {
    const { confirmpassword, ...infoValue } = this.profileForm.value;
    this.accountService.updateInfo(this.info.username, infoValue).subscribe({
      next: (data) => {
        this.accountService.userSubject.next(data);
        this.setValue(data);
        this.accountService.isLogin.next(true);
        sessionStorage.setItem('info', `${JSON.stringify(data)}`);
      },
    });
  }

  btnLogout() {
    this.accountService.logout();
  }
}
