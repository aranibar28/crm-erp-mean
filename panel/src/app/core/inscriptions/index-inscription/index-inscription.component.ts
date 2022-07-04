import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CollaboratorService } from 'src/app/services/collaborator.service';
import { CustomerService } from 'src/app/services/customer.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import Swal from 'sweetalert2';
import { ExportToCsv } from 'export-to-csv';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-index-inscription',
  templateUrl: './index-inscription.component.html',
})
export class IndexInscriptionComponent implements OnInit {
  public user = JSON.parse(localStorage.getItem('x-user')!);
  public inscriptions: Array<any> = [];
  public inscriptions_arr: Array<any> = [];
  public arr_json: Array<any> = [];
  public advisors: Array<any> = [];
  public comments: Array<any> = [];
  public advisor = '';
  public from = '';
  public to = '';

  public load_data = false;
  public load_comments = false;
  public size = 1;
  public p = 1;

  public type_filter = '';
  public interruptor = 'input';
  public value_filter = '';

  constructor(
    private inscriptionService: InscriptionService,
    private collaboratorService: CollaboratorService,
    private customerService: CustomerService,
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

  init_comments(id: any) {
    this.load_comments = true;
    this.inscriptionService.list_comments(id).subscribe({
      next: (res) => {
        this.comments = res.data;
        this.load_comments = false;
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

  generate_token(inscription: any, customer: any) {
    this.customerService.generate_token(inscription, customer).subscribe({
      next: (res) => {
        window.open('/survey/' + res.token);
      },
    });
  }

  prepared_data() {
    this.arr_json = [];
    for (var item of this.inscriptions) {
      let fecha = moment(item.created_at).format('YYYY-MM-DD');
      let color = '';

      if (item.status == 'Cancelado') {
        color = 'F78870';
      } else if (item.status == 'Procesando') {
        color = '70F793';
      }

      this.arr_json.push({
        customer: item.customer.full_name,
        email: item.customer.email,
        channel: item.channel,
        advisor: item.advisor.full_name,
        total: item.amount,
        matricula: item.matricula,
        date: fecha,
        color: color,
      });
    }
  }

  to_excel() {
    if (this.inscriptions.length == 0) {
      Swal.fire('', 'No hay matrículas para exportar.', 'warning');
      return;
    }

    this.prepared_data();
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Matriculas');

    worksheet.addRow(undefined);
    for (let x1 of this.arr_json) {
      let x2 = Object.keys(x1);

      let temp = [];
      for (let y of x2) {
        temp.push(x1[y]);
      }
      let item = worksheet.addRow(temp);
      item.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: x1.color,
        },
      };
    }

    let fname = 'Matriculas';

    worksheet.columns = [
      { header: 'Cliente', key: 'col1', width: 30 },
      { header: 'Correo', key: 'col2', width: 25 },
      { header: 'Canal', key: 'col3', width: 20 },
      { header: 'Asesor', key: 'col4', width: 30 },
      { header: 'Monto', key: 'col5', width: 15 },
      { header: 'Matricula', key: 'col6', width: 15 },
      { header: 'Fecha', key: 'col7', width: 20 },
    ] as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, fname + '.xlsx');
    });
  }

  to_csv() {
    if (this.inscriptions.length == 0) {
      Swal.fire('', 'No hay matrículas para exportar.', 'warning');
      return;
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Lista de Inscripciones',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };

    this.arr_json = [];
    this.prepared_data();
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.arr_json);
  }
}
