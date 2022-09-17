import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: [],
      password: ['', Validators.required],
      confirmPass: ['', Validators.required],
    });
  }

  get username() {
    return this.signupForm.controls['username'];
  }

  get password() {
    return this.signupForm.controls['password'];
  }
  get confirmPass() {
    return this.signupForm.controls['confirmPass'];
  }

  btnSignup() {
    const { confirmPass, ...data } = this.signupForm.value;
    this.accountService.signup(data).subscribe({
      next: (data) => this.router.navigate(['/login']),
      error: (error) => console.log(error),
      complete: () => console.log('Completed'),
    });
  }
}
