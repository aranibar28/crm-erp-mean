import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-mail-customer',
  templateUrl: './mail-customer.component.html',
})
export class MailCustomerComponent implements OnInit {
  public id: any;

  constructor(private activatedRoute: ActivatedRoute) {
    this.id = this.activatedRoute.snapshot.parent?.params['id'];
  }

  ngOnInit(): void {}
}
