import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public load_btn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.token) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  myForm: FormGroup = this.fb.group({
    email: [, [Validators.required, Validators.minLength(3)]],
    password: [, [Validators.required]],
  });

  login() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.authService.login(this.myForm.value).subscribe({
      next: (res) => {
        if (res.data) {
          let { data, token } = res;
          localStorage.setItem('x-id', data._id);
          localStorage.setItem('x-token', token);
          localStorage.setItem('x-user', JSON.stringify(data));
          this.authService.success('Bienvenido ' + data.full_name);
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.navigateByUrl('/dashboard');
        } else {
          this.authService.danger(res.msg);
        }
      },
      error: (err) => {
        this.authService.danger(err.msg);
      },
    });
  }

  validate(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
