import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
})
export class BuyerComponent implements OnInit {
  public load_data: boolean = true;
  public load_btn: boolean = false;
  public customer: any = {};
  public menu: any[] = [];
  public title: any;
  public id: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private publicService: PublicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.menu = this.publicService.menu;
    this.title = document.title;
    this.init_data();
  }

  ngOnDestroy(): void {
    document.title = 'Panel Administrador';
  }

  new_title(title: string) {
    this.title = title;
  }

  init_data() {
    this.customerService.read_customer_by_id(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.customer = res.data;
        } else {
          this.router.navigateByUrl('/dashboard/customers');
        }
      },
      error: (err) => console.log(err),
    });
  }
}
