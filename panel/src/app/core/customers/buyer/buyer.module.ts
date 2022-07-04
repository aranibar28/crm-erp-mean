import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxTinymceModule } from 'ngx-tinymce';

import { BuyerComponent } from './buyer.component';
import { SanitizingPipe } from 'src/app/pipes/sanitizing.pipe';
import { TimePipe } from 'src/app/pipes/time.pipe';

import { DashboardCustomerComponent } from './dashboard-customer/dashboard-customer.component';
import { ActivityCustomerComponent } from './activity-customer/activity-customer.component';
import { InterestCustomerComponent } from './interest-customer/interest-customer.component';
import { TaskCustomerComponent } from './task-customer/task-customer.component';
import { CallCustomerComponent } from './call-customer/call-customer.component';
import { MailCustomerComponent } from './mail-customer/mail-customer.component';

@NgModule({
  declarations: [
    TimePipe,
    SanitizingPipe,
    BuyerComponent,
    DashboardCustomerComponent,
    ActivityCustomerComponent,
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
    NgxTinymceModule.forRoot({
      baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.4/',
    }),
  ],
})
export class BuyerModule {}
