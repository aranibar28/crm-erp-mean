import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { IndexProductComponent } from './index-product/index-product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { InventoryProductComponent } from './inventory-product/inventory-product.component';

@NgModule({
  declarations: [
    IndexProductComponent,
    CreateProductComponent,
    UpdateProductComponent,
    InventoryProductComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
})
export class ProductsModule {}
