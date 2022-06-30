import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-inscription',
  templateUrl: './payment-inscription.component.html',
})
export class PaymentInscriptionComponent implements OnInit {
  public img_url = environment.img_url;
  public load_data = false;
  public my_data = false;
  public id: any;

  public inscription: any = {};
  public details: Array<any> = [];
  public payments: Array<any> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private inscriptionService: InscriptionService,
    private paymentsService: PaymentsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
  }

  init_data() {
    this.load_data = true;
    this.inscriptionService.read_inscription_by_id(this.id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.data) {
          this.my_data = true;
          this.load_data = false;
          this.inscription = res.data;
          this.details = res.details;
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
        this.payments = res.data;
      },
    });
  }
}
