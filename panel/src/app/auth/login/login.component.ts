import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public load_btn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.authService.token) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  myForm: FormGroup = this.fb.group({
    email: [, [Validators.required, Validators.email]],
    password: [, [Validators.required, Validators.minLength(3)]],
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
          this.router.navigateByUrl('/dashboard');
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          Swal.fire('Bienvenido!', 'Hola ' + data.full_name, 'success');
        } else {
          Swal.fire('', res.msg, 'error');
        }
      },
      error: (err) => {
        Swal.fire('', err.msg, 'error');
      },
    });
  }

  validate(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
