import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { IndexInscriptionComponent } from './index-inscription/index-inscription.component';
import { CreateInscriptionComponent } from './create-inscription/create-inscription.component';
import { UpdateInscriptionComponent } from './update-inscription/update-inscription.component';

@NgModule({
  declarations: [
    IndexInscriptionComponent,
    CreateInscriptionComponent,
    UpdateInscriptionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
})
export class InscriptionsModule {}
