import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';
declare var $: any;

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
})
export class UpdateCustomerComponent implements OnInit {
  public collaborator: any = {};
  public load_data: boolean = true;
  public load_btn: boolean = false;
  public id: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private publicService: PublicService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
  }

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

  init_data() {
    this.customerService.read_customer_by_id(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.collaborator = res.data;
          this.myForm.patchValue(this.collaborator);
        } else {
          this.router.navigateByUrl('/dashboard/customers');
        }
      },
      error: (err) => console.log(err),
    });
  }

  update() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    if ($('#input_password').val() == '') {
      this.myForm.controls['password'].setValue(this.collaborator.password);
    } else {
      this.myForm.controls['password'].setValue($('#input_password').val());
    }

    this.load_btn = true;
    this.customerService.update_customer(this.id, this.myForm.value).subscribe({
      next: (res) => {
        if (res.data) {
          this.load_btn = false;
          this.router.navigateByUrl('/dashboard/customers');
          this.publicService.success('Se guardó correctamente');
        } else {
          this.load_btn = false;
          this.publicService.danger(res.msg);
        }
      },
      error: (err) => {
        this.load_btn = false;
        this.publicService.danger(err.msg);
      },
    });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
