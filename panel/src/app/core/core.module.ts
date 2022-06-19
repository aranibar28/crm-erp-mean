import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreComponent } from './core.component';
import { SharedModule } from '../shared/shared.module';
import { AccountModule } from './account/account.module';
import { BuyerModule } from './customers/buyer/buyer.module';
import { CustomersModule } from './customers/customers.module';
import { CollaboratorModule } from './collaborator/collaborator.module';
import { CoursesModule } from './courses/courses.module';
import { CyclesModule } from './cycles/cycles.module';

@NgModule({
  declarations: [CoreComponent],
  imports: [
    RouterModule,
    SharedModule,
    AccountModule,
    BuyerModule,
    CustomersModule,
    CollaboratorModule,
    CoursesModule,
    CyclesModule,
  ],
  exports: [CoreComponent],
})
export class CoreModule {}
