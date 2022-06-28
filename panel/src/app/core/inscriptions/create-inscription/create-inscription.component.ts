import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { CustomerService } from 'src/app/services/customer.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
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
  public inscription: any = { origin: 'Interno', matricula: 0, channel: '' };
  public amount = 0;
  public discount = 0;
  public course: any = {};

  public rooms: Array<any> = [];
  public temp_subtotal = 0;
  public detail_subtotal = 0;
  public detail_discount = 0;
  public detail_total = 0;
  public discount_type = '';
  public discount_value = 0;

  public detail: any = {};
  public details: Array<any> = [];

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
    let val_select = event.target.value;
    let arr_select = val_select.split('_');
    this.detail.course = arr_select[0];
    this.detail.title_course = arr_select[1];
    this.load_cycles = true;

    this.courseService.read_current_cycles(this.detail.course).subscribe({
      next: (res) => {
        this.cycles = [];
        res.data.forEach((element: any) => {
          if (element.cycle.status) {
            this.cycles.push(element);
          }
        });
        this.load_cycles = false;
        this.cycles_arr = res.data;
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

  select_cycle(item: any) {
    this.rooms = item.rooms;
    this.temp_subtotal = item.cycle.price;
    this.detail_subtotal = item.cycle.price;
    this.detail_total = this.detail_subtotal;
    this.detail.start_date = item.cycle.start_date;
    this.detail.final_date = item.cycle.final_date;
    this.detail.cycle_course = item.cycle._id;
    $('#inp_cycle').val(item.cycle.nivel);
    $('#modalCycles').modal('hide');
  }

  select_room(event: any, item: any) {
    this.detail.cycle_room = event.target.value;
    this.detail.n_clases = item.frequency.length * 4;
    this.detail.title_room = item.room;
  }

  aply_discount() {
    if (this.discount_type == 'Precio Fijo') {
      if (this.discount_value < this.detail_subtotal) {
        this.detail_discount = this.discount_value;
        this.detail_total = this.detail_subtotal - this.detail_discount;
        this.detail.discount_type = this.discount_type;
        this.detail.discount_value = this.detail_discount;
      } else {
        this.detail_discount = 0;
        this.detail_total = this.temp_subtotal;
        Swal.fire('', 'El descuento debe ser menor al subtotal.', 'info');
      }
    } else {
      if (this.discount_value < 100) {
        this.detail_discount =
          (this.detail_subtotal * this.discount_value) / 100;
        this.detail_total = this.detail_subtotal - this.detail_discount;
        this.detail.discount_type = this.discount_type;
        this.detail.discount_value = this.detail_discount;
      } else {
        this.detail_discount = 0;
        this.detail_total = this.temp_subtotal;
        Swal.fire('', 'El porcentaje debe ser menor del 100%.', 'info');
      }
    }
  }

  add_detail() {
    this.detail.price = this.detail_total;

    if (this.detail.price == 0) {
      Swal.fire('', 'El precio no puede ser 0.', 'error');
    } else if (!this.detail.course) {
      Swal.fire('', 'Seleccione un curso base.', 'info');
    } else if (!this.detail.cycle_course) {
      Swal.fire('', 'Seleccione un ciclo.', 'info');
    } else if (!this.detail.cycle_room) {
      Swal.fire('', 'Seleccione un salon.', 'info');
    } else {
      this.details.push(this.detail);
      this.amount = this.amount + this.detail.price;
      if (this.detail.discount_value) {
        this.discount = this.discount + this.detail.discount_value;
      }
      this.reset_detail();
    }
  }

  del_detail(id: any, item: any) {
    this.amount = this.amount - item.price;
    this.details.splice(id, 1);
    if (item.discount_value) {
      this.discount = this.discount - item.discount_value;
    }
  }

  reset_detail() {
    this.rooms = [];
    this.detail = {};
    this.discount_type = '';
    this.discount_value = 0;
    this.temp_subtotal = 0;
    this.detail_subtotal = 0;
    this.detail_discount = 0;
    this.detail_total = 0;
    $('#inp_cycle').val('');
    $('#select_course').val('');
  }

  register() {
    if (this.details.length == 0) {
      Swal.fire('', 'Debe ingresar como mínimo un ciclo.', 'info');
    } else if (this.inscription.matricula < 0) {
      Swal.fire('', 'Ingrese un valor válido de matrícula.', 'info');
    } else if (!this.inscription.customer) {
      Swal.fire('', 'Seleccione un cliente.', 'info');
    } else if (!this.inscription.channel) {
      Swal.fire('', 'Seleccione un canal. ', 'info');
    } else {
      this.inscription.amount = this.amount;
      this.inscription.discount = this.discount;
      console.log(this.inscription);
      console.log(this.details);
    }
  }
}
