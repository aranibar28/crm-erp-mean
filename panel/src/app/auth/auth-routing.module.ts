import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SatisfactionSurveyComponent } from './surveys/satisfaction-survey/satisfaction-survey.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verification/:token', component: VerifyComponent },
  { path: 'survey/:token', component: SatisfactionSurveyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
