import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-dashboard-customer',
  templateUrl: './dashboard-customer.component.html',
})
export class DashboardCustomerComponent implements OnInit {
  public id = this.activatedRoute.snapshot.parent?.params['id'];

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}
}
