import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { NotfoundComponent } from './notfound/notfound.component';

@NgModule({
  declarations: [
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    BreadcrumbsComponent,
    NotfoundComponent,
  ],
  imports: [
    CommonModule, 
    RouterModule
  ],
  exports: [
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    BreadcrumbsComponent,
    NotfoundComponent,
  ],
})
export class SharedModule {}
