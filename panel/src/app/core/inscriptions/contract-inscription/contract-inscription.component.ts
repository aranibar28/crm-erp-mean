import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';
import { I18nInterface } from 'ngx-image-drawing';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-contract-inscription',
  templateUrl: './contract-inscription.component.html',
})
export class ContractInscriptionComponent implements OnInit {
  public inscription: any = {};
  public load_data = false;
  public my_data = false;
  public id: any;

  public i18n: I18nInterface = {
    saveBtn: 'Confirmar firma',
    sizes: { extra: 'Extra' },
  };

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

  save(event: any) {
    var reader = new FileReader();
    reader.readAsDataURL(event);
    reader.onload = () => {
      var img = reader.result;
      $('#firma_img').val(img);
      let firm = $('#firma_img').val();
      this.inscriptionService.firm_inscription(this.id, { firm }).subscribe({
        next: (res) => {
          this.init_data();
          Swal.fire('Muy bien!', 'Se guardaron los datos.', 'success');
        },
      });
    };
  }

  cancel() {}
}
