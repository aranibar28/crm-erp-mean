import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxTinymceModule } from 'ngx-tinymce';

import { IndexCycleComponent } from './index-cycle/index-cycle.component';
import { CreateCycleComponent } from './create-cycle/create-cycle.component';
import { UpdateCycleComponent } from './update-cycle/update-cycle.component';
import { ExpiredCycleComponent } from './expired-cycle/expired-cycle.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    IndexCycleComponent,
    CreateCycleComponent,
    UpdateCycleComponent,
    ExpiredCycleComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxTinymceModule.forRoot({
      baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.4/',
    }),
  ],
})
export class CyclesModule {}
