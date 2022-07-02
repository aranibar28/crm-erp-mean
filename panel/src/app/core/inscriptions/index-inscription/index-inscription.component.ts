import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CollaboratorService } from 'src/app/services/collaborator.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-index-inscription',
  templateUrl: './index-inscription.component.html',
})
export class IndexInscriptionComponent implements OnInit {
  public user = JSON.parse(localStorage.getItem('x-user')!);
  public inscriptions: Array<any> = [];
  public inscriptions_arr: Array<any> = [];
  public advisors: Array<any> = [];
  public advisor = '';
  public from = '';
  public to = '';

  public load_data = false;
  public size = 1;
  public p = 1;

  public type_filter = '';
  public interruptor = 'input';
  public value_filter = '';

  constructor(
    private inscriptionService: InscriptionService,
    private collaboratorService: CollaboratorService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 200);
    this.init_iscriptions_today();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.advisor = params['advisor'];
      this.from = params['from'];
      this.to = params['to'];
      if (this.advisor && this.from && this.to) {
        this.init_iscriptions_dates();
      } else {
        this.advisor = 'all';
        this.init_iscriptions_today();
      }
    });
  }

  init_iscriptions_today() {
    this.load_data = true;
    this.inscriptionService.read_inscriptions_today().subscribe({
      next: (res) => {
        this.load_data = false;
        this.inscriptions = res.data;
        this.inscriptions_arr = res.data;
      },
    });
  }

  init_iscriptions_dates() {
    this.load_data = true;
    this.inscriptionService
      .read_inscriptions_dates(this.advisor, this.from, this.to)
      .subscribe({
        next: (res) => {
          this.load_data = false;
          this.inscriptions = res.data;
          this.inscriptions_arr = res.data;
        },
      });
  }

  init_advisors() {
    this.collaboratorService.list_advisors().subscribe({
      next: (res) => {
        this.advisors = res.data;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh');
        }, 200);
      },
    });
  }

  filter() {
    if (!this.from || !this.to) {
      Swal.fire('', 'Seleccione un rango de fechas.', 'warning');
    } else {
      this.router.navigate(['/dashboard/inscriptions'], {
        queryParams: { advisor: this.advisor, from: this.from, to: this.to },
      });
    }
  }

  get_type_filter() {
    if (this.type_filter == 'canal') {
      this.interruptor = 'select';
    } else {
      this.interruptor = 'input';
      this.value_filter = '';
    }
  }

  search_advanced() {
    if (this.type_filter) {
      if (this.type_filter == 'codigo') {
        let term = new RegExp(this.value_filter, 'i');
        this.inscriptions = this.inscriptions_arr.filter((item) =>
          term.test(item._id)
        );
      } else if (this.type_filter == 'nombres') {
        let term = new RegExp(this.value_filter, 'i');
        this.inscriptions = this.inscriptions_arr.filter((item) =>
          term.test(item.customer.full_name)
        );
      } else if (this.type_filter == 'canal') {
        let term = new RegExp(this.value_filter, 'i');
        this.inscriptions = this.inscriptions_arr.filter((item) =>
          term.test(item.channel)
        );
      }
      this.p = 1;
      $('#modalAdvanced').modal('hide');
    } else {
      Swal.fire('Ups!', 'Seleccione el tipo del filtro', 'error');
    }
  }

  clean_arr() {
    this.inscriptions = this.inscriptions_arr;
    this.interruptor = 'input';
    this.type_filter = '';
    this.value_filter = '';
    this.p = 1;
  }

  cancel_inscription(id: any) {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'Cancelar la siguiente matrícula.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.inscriptionService.cancel_inscription(id).subscribe({
          next: (res) => {
            if (res.data) {
              Swal.fire('Listo!', 'Matricula cancelada', 'success');
              if (this.advisor && this.from && this.to) {
                this.init_iscriptions_dates();
              } else {
                this.advisor = 'all';
                this.init_iscriptions_today();
              }
            } else {
              Swal.fire('Ups!', res.msg, 'error');
            }
          },
        });
      }
    });
  }

  send_email(id: any) {
    Swal.fire({
      title: 'Reenviar la orden de compra',
      text: 'Se reenviará una orden de compra por correo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí reenviar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.inscriptionService.send_invoice(id).subscribe({
          next: (res) => {
            Swal.fire('Listo!', 'Mensaje enviado.', 'success');
          },
        });
      }
    });
  }
}
