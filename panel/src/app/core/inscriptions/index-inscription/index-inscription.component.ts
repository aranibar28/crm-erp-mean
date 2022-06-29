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
  public inscriptions: Array<any> = [];
  public advisors: Array<any> = [];
  public advisor = '';
  public from = '';
  public to = '';

  public load_data = false;
  public size = 1;
  public p = 1;

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
            console.log(res);
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }
}
