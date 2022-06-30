import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';

@Component({
  selector: 'app-contract-inscription',
  templateUrl: './contract-inscription.component.html',
})
export class ContractInscriptionComponent implements OnInit {
  public inscription: any = {};
  public load_data = false;
  public my_data = false;
  public id: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private inscriptionService: InscriptionService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
  }

  init_data() {
    this.load_data = true;
    this.inscriptionService.read_inscription_by_id(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.my_data = true;
          this.inscription = res.data;
        } else {
          this.my_data = false;
        }
        this.load_data = false;
      },
    });
  }
}
