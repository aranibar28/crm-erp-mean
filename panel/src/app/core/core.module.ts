import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreComponent } from './core.component';
import { SharedModule } from '../shared/shared.module';
import { AccountModule } from './account/account.module';
import { BuyerModule } from './customers/buyer/buyer.module';
import { CollaboratorsModule } from './collaborators/collaborators.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { InscriptionsModule } from './inscriptions/inscriptions.module';
import { CoursesModule } from './courses/courses.module';
import { CyclesModule } from './cycles/cycles.module';

@NgModule({
  declarations: [CoreComponent],
  imports: [
    RouterModule,
    SharedModule,
    AccountModule,
    BuyerModule,
    CollaboratorsModule,
    CustomersModule,
    ProductsModule,
    InscriptionsModule,
    CoursesModule,
    CyclesModule,
  ],
  exports: [CoreComponent],
})
export class CoreModule {}
