import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyComponent } from './verify/verify.component';
import { SatisfactionSurveyComponent } from './surveys/satisfaction-survey/satisfaction-survey.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    SatisfactionSurveyComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthRoutingModule,
  ],
})
export class AuthModule {}
