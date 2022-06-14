import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { CoreRoutingModule } from './core/core-routing.module';

const routes: Routes = [
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), AuthRoutingModule, CoreRoutingModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
