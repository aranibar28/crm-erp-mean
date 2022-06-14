import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyerComponent } from './buyer.component';
import { DashboardCustomerComponent } from './dashboard-customer/dashboard-customer.component';
import { ProspectCustomerComponent } from './prospect-customer/prospect-customer.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { InterestCustomerComponent } from './interest-customer/interest-customer.component';
import { TaskCustomerComponent } from './task-customer/task-customer.component';
import { CallCustomerComponent } from './call-customer/call-customer.component';
import { MailCustomerComponent } from './mail-customer/mail-customer.component';

@NgModule({
  declarations: [
    BuyerComponent,
    DashboardCustomerComponent,
    ProspectCustomerComponent,
    InterestCustomerComponent,
    TaskCustomerComponent,
    CallCustomerComponent,
    MailCustomerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
})
export class BuyerModule {}
