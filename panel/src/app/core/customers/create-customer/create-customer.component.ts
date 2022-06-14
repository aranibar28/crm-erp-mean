import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
})
export class CreateCustomerComponent implements OnInit {
  public load_btn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  myForm: FormGroup = this.fb.group({
    first_name: [, [Validators.required, Validators.minLength(3)]],
    last_name: [, [Validators.required, Validators.minLength(3)]],
    email: [, [Validators.required, Validators.email]],
    password: [, [Validators.required, Validators.minLength(3)]],
    dni: [,],
    phone: [,],
    genre: [''],
    birthday: [],
    country: [''],
    city: [''],
  });

  register() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.load_btn = true;
    this.customerService.create_customer(this.myForm.value).subscribe({
      next: (res) => {
        if (res.data) {
          this.load_btn = false;
          this.customerService.success('Datos guardados correctamente.');
          this.router.navigateByUrl('/dashboard/customers');
        } else {
          this.load_btn = false;
          this.customerService.danger(res.msg);
        }
      },
      error: (err) => {
        this.load_btn = false;
        this.customerService.danger(err.msg);
      },
    });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
