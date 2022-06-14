import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-task-customer',
  templateUrl: './task-customer.component.html',
})
export class TaskCustomerComponent implements OnInit {
  public id: any;

  constructor(private activatedRoute: ActivatedRoute) {
    this.id = this.activatedRoute.snapshot.parent?.params['id'];
  }

  ngOnInit(): void {}
}
