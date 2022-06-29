import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { SharedModule } from 'src/app/shared/shared.module';
import { IndexInscriptionComponent } from './index-inscription/index-inscription.component';
import { CreateInscriptionComponent } from './create-inscription/create-inscription.component';
import { UpdateInscriptionComponent } from './update-inscription/update-inscription.component';
import { DetailsInscriptionComponent } from './details-inscription/details-inscription.component';
import { ContractInscriptionComponent } from './contract-inscription/contract-inscription.component';

@NgModule({
  declarations: [
    IndexInscriptionComponent,
    CreateInscriptionComponent,
    UpdateInscriptionComponent,
    DetailsInscriptionComponent,
    ContractInscriptionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
})
export class InscriptionsModule {}
