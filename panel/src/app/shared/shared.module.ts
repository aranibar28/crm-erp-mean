import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [SidebarComponent, FooterComponent, HeaderComponent, BreadcrumbsComponent],
  imports: [CommonModule, RouterModule],
  exports: [SidebarComponent, FooterComponent, HeaderComponent, BreadcrumbsComponent],
})
export class SharedModule {}
