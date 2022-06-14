import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreComponent } from './core.component';
import { SharedModule } from '../shared/shared.module';
import { AccountModule } from './account/account.module';
import { CollaboratorModule } from './collaborator/collaborator.module';
import { CustomersModule } from './customers/customers.module';
import { BuyerModule } from './customers/buyer/buyer.module';

@NgModule({
  declarations: [CoreComponent],
  imports: [
    RouterModule,
    SharedModule,
    AccountModule,
    CollaboratorModule,
    CustomersModule,
    BuyerModule
  ],
  exports: [CoreComponent],
})
export class CoreModule {}
