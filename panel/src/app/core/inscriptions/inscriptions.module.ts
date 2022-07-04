import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ImageDrawingModule } from 'ngx-image-drawing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ZfillPipe } from 'src/app/pipes/zfill.pipe';

import { IndexInscriptionComponent } from './index-inscription/index-inscription.component';
import { CreateInscriptionComponent } from './create-inscription/create-inscription.component';
import { DetailsInscriptionComponent } from './details-inscription/details-inscription.component';
import { ContractInscriptionComponent } from './contract-inscription/contract-inscription.component';
import { PaymentInscriptionComponent } from './payment-inscription/payment-inscription.component';
import { SurveyInscriptionComponent } from './survey-inscription/survey-inscription.component';

@NgModule({
  declarations: [
    IndexInscriptionComponent,
    CreateInscriptionComponent,
    DetailsInscriptionComponent,
    ContractInscriptionComponent,
    PaymentInscriptionComponent,
    SurveyInscriptionComponent,
    ZfillPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ImageDrawingModule,
  ],
})
export class InscriptionsModule {}
