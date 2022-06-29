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
import { ActivityCustomerComponent } from './customers/buyer/activity-customer/activity-customer.component';
import { InterestCustomerComponent } from './customers/buyer/interest-customer/interest-customer.component';
import { CallCustomerComponent } from './customers/buyer/call-customer/call-customer.component';
import { MailCustomerComponent } from './customers/buyer/mail-customer/mail-customer.component';
import { TaskCustomerComponent } from './customers/buyer/task-customer/task-customer.component';

import { IndexCourseComponent } from './courses/index-course/index-course.component';
import { CreateCourseComponent } from './courses/create-course/create-course.component';
import { UpdateCourseComponent } from './courses/update-course/update-course.component';

import { IndexCycleComponent } from './cycles/index-cycle/index-cycle.component';
import { ExpiredCycleComponent } from './cycles/expired-cycle/expired-cycle.component';
import { CreateCycleComponent } from './cycles/create-cycle/create-cycle.component';
import { UpdateCycleComponent } from './cycles/update-cycle/update-cycle.component';

import { IndexInscriptionComponent } from './inscriptions/index-inscription/index-inscription.component';
import { CreateInscriptionComponent } from './inscriptions/create-inscription/create-inscription.component';
import { UpdateInscriptionComponent } from './inscriptions/update-inscription/update-inscription.component';
import { DetailsInscriptionComponent } from './inscriptions/details-inscription/details-inscription.component';

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
      { path: 'dashboard', component: DashboardCustomerComponent, title: 'Dashboard' },
      { path: 'activities', component: ActivityCustomerComponent, title: 'Actividades' },
      { path: 'interest', component: InterestCustomerComponent, title: 'Intereses' },
      { path: 'call', component: CallCustomerComponent, title: 'Llamadas' },
      { path: 'mail', component: MailCustomerComponent, title: 'Correos' },
      { path: 'task', component: TaskCustomerComponent, title: 'Tareas' },
      { path: '**', redirectTo: 'Dashboard' },
    ],
  },

  { path: 'courses', component: IndexCourseComponent },
  { path: 'courses/create', component: CreateCourseComponent },
  { path: 'courses/:id', component: UpdateCourseComponent },
  { path: 'courses/:id/cycles', component: IndexCycleComponent },
  { path: 'courses/:id/cycles/expired', component: ExpiredCycleComponent },
  { path: 'courses/:id/cycles/create', component: CreateCycleComponent },
  { path: 'courses/:id/cycles/update/:cycle', component: UpdateCycleComponent },

  { path: 'inscriptions', component: IndexInscriptionComponent },
  { path: 'inscriptions/create', component: CreateInscriptionComponent },
  { path: 'inscriptions/details/:id', component: DetailsInscriptionComponent },
  { path: 'inscriptions/:id', component: UpdateInscriptionComponent },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
