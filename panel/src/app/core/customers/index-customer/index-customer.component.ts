import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-customer',
  templateUrl: './index-customer.component.html',
})
export class IndexCustomerComponent implements OnInit {
  public customers: Array<any> = [];
  public customers_arr: Array<any> = [];
  public load_data: boolean = false;
  public filter: string = '';
  public p: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private publicService: PublicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.filter = params['filter'];
      if (this.filter) {
        this.search();
      } else {
        this.customers = [];
      }
    });
  }

  init_data() {
    if (this.filter) {
      this.router.navigate(['/dashboard/customers'], {
        queryParams: { filter: this.filter },
      });
    } else {
      this.router.navigate(['/dashboard/customers']);
    }
  }

  search() {
    if (this.filter) {
      this.load_data = true;
      this.customerService.read_customers(this.filter).subscribe({
        next: (res) => {
          this.customers = res.data;
          this.load_data = false;
        },
      });
    } else {
      this.customers = [];
    }
  }

  change_status(id: any, status: any) {
    const word = status ? 'desactivado' : 'activado';
    this.customerService.change_status(id, { status }).subscribe({
      next: () => {
        this.init_data();
        this.publicService.success(`Estado ${word}.`);
      },
    });
  }

  delete_data(id: any, name: any) {
    Swal.fire({
      title: 'Eliminar Cliente',
      text: `¿Desea eliminar el Cliente ${name}?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.delete_customer(id).subscribe(() => {
          this.publicService.success(`Cliente ${name} eliminado.`);
          this.init_data();
        });
      }
    });
  }
}
