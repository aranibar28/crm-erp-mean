import { Component, OnInit } from '@angular/core';
import { CollaboratorService } from 'src/app/services/collaborator.service';
import { InscriptionService } from 'src/app/services/inscription.service';
declare var $: any;

@Component({
  selector: 'app-index-inscription',
  templateUrl: './index-inscription.component.html',
})
export class IndexInscriptionComponent implements OnInit {
  public inscriptions: Array<any> = [];
  public advisors: Array<any> = [];
  public advisor = 'all';
  public from = '';
  public to = '';

  public load_data = false;
  public size = 1;
  public p = 1;

  constructor(
    private inscriptionService: InscriptionService,
    public collaboratorService: CollaboratorService
  ) {}

  ngOnInit(): void {
    this.init_data();
    this.init_advisors();
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 200);
  }

  init_data() {
    this.load_data = true;
    this.inscriptionService.read_inscriptions_today().subscribe({
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

  search_inscriptions() {
    if (!this.from || !this.to) {
      return;
    }
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
}
