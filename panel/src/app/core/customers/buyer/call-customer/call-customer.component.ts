import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-call-customer',
  templateUrl: './call-customer.component.html',
})
export class CallCustomerComponent implements OnInit {
  public id: any;

  constructor(private activatedRoute: ActivatedRoute) {
    this.id = this.activatedRoute.snapshot.parent?.params['id'];
  }

  ngOnInit(): void {}
}
