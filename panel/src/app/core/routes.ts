import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './account/dashboard/dashboard.component';

import { CreateCollaboratorComponent } from './collaborator/create-collaborator/create-collaborator.component';
import { IndexCollaboratorComponent } from './collaborator/index-collaborator/index-collaborator.component';
import { UpdateCollaboratorComponent } from './collaborator/update-collaborator/update-collaborator.component';

import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';
import { IndexCustomerComponent } from './customers/index-customer/index-customer.component';
import { UpdateCustomerComponent } from './customers/update-customer/update-customer.component';

import { BuyerComponent } from './customers/buyer/buyer.component';
import { DashboardCustomerComponent } from './customers/buyer/dashboard-customer/dashboard-customer.component';
import { ProspectCustomerComponent } from './customers/buyer/prospect-customer/prospect-customer.component';
import { InterestCustomerComponent } from './customers/buyer/interest-customer/interest-customer.component';
import { MailCustomerComponent } from './customers/buyer/mail-customer/mail-customer.component';
import { CallCustomerComponent } from './customers/buyer/call-customer/call-customer.component';
import { TaskCustomerComponent } from './customers/buyer/task-customer/task-customer.component';

const childRoutes: Routes = [
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },

  { path: 'collaborator', component: IndexCollaboratorComponent },
  { path: 'collaborator/create', component: CreateCollaboratorComponent },
  { path: 'collaborator/:id', component: UpdateCollaboratorComponent },

  { path: 'customers', component: IndexCustomerComponent },
  { path: 'customers/create', component: CreateCustomerComponent },
  { path: 'customers/:id', component: UpdateCustomerComponent },

  {
    path: 'customers/buyer/:id',
    component: BuyerComponent,
    children: [
      { path: 'dashboard', component: DashboardCustomerComponent, title: 'Dashboard'},
      { path: 'prospect', component: ProspectCustomerComponent, title: 'Actividades'},
      { path: 'interest', component: InterestCustomerComponent, title: 'Intereses'},
      { path: 'mail', component: MailCustomerComponent, title: 'Correos'},
      { path: 'call', component: CallCustomerComponent, title: 'Llamadas'},
      { path: 'task', component: TaskCustomerComponent, title: 'Tareas'},
      { path: '**', redirectTo: 'Dashboard' },
    ],
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
