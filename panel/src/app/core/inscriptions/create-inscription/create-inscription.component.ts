import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { CustomerService } from 'src/app/services/customer.service';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-create-inscription',
  templateUrl: './create-inscription.component.html',
})
export class CreateInscriptionComponent implements OnInit {
  public img_url = environment.img_url;
  public load_data = false;
  public load_cycles = false;
  public filter = '';
  public filter_cycle = '';
  public p = 1;

  public customers: Array<any> = [];
  public courses: Array<any> = [];
  public cycles: Array<any> = [];
  public cycles_arr: Array<any> = [];
  public inscription: any = { origen: '', matricula: 0, canal: '' };
  public monto = 0;
  public discount = 0;
  public course: any = {};

  constructor(
    private customerService: CustomerService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 200);
    this.init_courses();
  }

  search_customers() {
    this.load_data = true;
    this.customerService.list_customers(this.filter).subscribe({
      next: (res) => {
        this.customers = res.data;
        this.load_data = false;
      },
    });
  }

  select_customer(item: any) {
    this.inscription.customer = item._id;
    $('#inp_customer').val(item.full_name);
    $('#modalCustomer').modal('hide');
  }

  init_courses() {
    this.courseService.list_courses().subscribe({
      next: (res) => (this.courses = res.data),
    });
  }

  select_course(event: any) {
    const id = event.target.value;
    this.load_cycles = true;
    this.courseService.read_current_cycles(id).subscribe({
      next: (res) => {
        this.load_cycles = false;
        this.cycles_arr = res.data;
        this.cycles = res.data;
      },
    });
  }

  search_cycle() {
    let term = new RegExp(this.filter_cycle, 'i');
    if (this.filter) {
      this.cycles = this.cycles.filter((item) => term.test(item.cycle._id));
    } else {
      this.cycles = this.cycles_arr;
    }
  }

  register() {
    console.log(this.inscription);
  }
}
