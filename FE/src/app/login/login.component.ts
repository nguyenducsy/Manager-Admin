import {
  Component,
  DoCheck,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AccountService } from '../account.service';
import { User } from '../shared/user.modal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('isChecked') isChecked!: ElementRef;
  userData!: User;
  userForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('user')!)) {
      this.userData = JSON.parse(localStorage.getItem('user')!);
      this.userForm = this.fb.group({
        username: [this.userData.username, Validators.required],
        password: [this.userData.password, Validators.required],
      });
    } else {
      this.userForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
      });
    }
  }

  get username(){
    return this.userForm.controls['username'];
  }
  get password(){
    return this.userForm.controls['password'];
  }
  login(): void {
    const isCheck = this.isChecked.nativeElement.checked;
    
    if (this.userForm.valid == true) {
      this.accountService.login(this.userForm.value).subscribe({
        next: (data) => {
          if (isCheck == true) {
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('isRemember', JSON.stringify(true));
          } else {
            localStorage.setItem('isRemember', JSON.stringify(false));
            localStorage.removeItem('user');
            sessionStorage.setItem('user', JSON.stringify(data));
          }
          this.accountService.isLogin.next(true);
          this.accountService.userSubject.next(data);
          localStorage.setItem('isLogin', JSON.stringify(true));
          this.router.navigate(['/']);
        },
        error: (err) => console.log(err),
        complete: () => console.log('Completed!'),
      });
    } else console.log(this.userForm.status);
  }
}
