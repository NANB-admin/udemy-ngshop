import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'users-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup
  isSubmitted = false;
  authError = false;
  authMessage = " Email / Password is incorrect."
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private localStorageService: LocalStorageService, private router: Router) {

  }

  ngOnInit(): void {
    this._initLoginForm();
  }

  private _initLoginForm() {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get loginForm() {
    return this.loginFormGroup.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginFormGroup.invalid) {
      return;
    }
    this.authService.login(this.loginForm.email.value, this.loginForm.password.value).subscribe(user => {
      this.authError = false;
      this.localStorageService.setToken(user.token);
      this.router.navigate(['/']);
      // console.log(user);
    }, error => {
      this.authError = true;
      if (error.status !== 400) {
        this.authMessage = "Error in the Server. Please try again later."
      }
      // console.log(error);
    });
  }
}
