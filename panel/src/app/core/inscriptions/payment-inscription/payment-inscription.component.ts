import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { environment } from 'src/environments/environment';
import * as printJS from 'print-js';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-payment-inscription',
  templateUrl: './payment-inscription.component.html',
})
export class PaymentInscriptionComponent implements OnInit {
  public img_url = environment.img_url;
  public load_data = false;
  public load_btn = false;
  public my_data = false;
  public id: any;

  public inscription: any = {};
  public details: Array<any> = [];
  public payments: Array<any> = [];

  public total_amount = 0;
  public total_payment = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private inscriptionService: InscriptionService,
    private paymentsService: PaymentsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
  }

  myForm: FormGroup = this.fb.group({
    destination: ['', [Validators.required]],
    method: ['', [Validators.required]],
    bank: ['', [Validators.required]],
    date: [, [Validators.required]],
    transaction: ['', [Validators.required]],
    amount: [, [Validators.required]],
  });

  init_data() {
    this.load_data = true;
    this.inscriptionService.read_inscription_by_id(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.my_data = true;
          this.load_data = false;
          this.inscription = res.data;
          this.details = res.details;
          this.total_amount =
            this.inscription.amount + this.inscription.matricula;
          this.init_payment();
        } else {
          this.my_data = false;
          this.load_data = false;
        }
      },
    });
  }

  init_payment() {
    this.paymentsService.read_inscription_payments(this.id).subscribe({
      next: (res) => {
        this.total_payment = 0;
        this.payments = res.data;
        for (let item of this.payments) {
          this.total_payment = this.total_payment + item.amount;
        }
      },
    });
  }

  select_method(item: any) {
    this.myForm.controls['method'].setValue(item);
    $('#dropdownMethod').text(item);
  }

  select_bank(item: any) {
    this.myForm.controls['bank'].setValue(item);
    $('#dropdownBank').text(item);
  }

  register() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const customer = this.fb.control(this.inscription.customer._id);
    this.myForm.addControl('customer', customer);
    this.myForm.addControl('inscription', this.fb.control(this.id));
    this.myForm.addControl('origin', this.fb.control('Interno'));
    this.myForm.addControl('type', this.fb.control('Matricula'));
    this.load_btn = true;

    this.paymentsService
      .create_inscription_payment(this.myForm.value)
      .subscribe({
        next: () => {
          this.init_data();
          this.load_btn = false;
          $('#modalPayment').modal('hide');
          Swal.fire('Listo!', 'Pago realizado.', 'success');
        },
      });
  }

  print_ticket(i: any) {
    printJS({
      printable: ['printdiv-' + i],
      type: 'html',
    });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
