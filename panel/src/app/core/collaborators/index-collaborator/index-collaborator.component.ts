import { Component, OnInit } from '@angular/core';
import { CollaboratorService } from 'src/app/services/collaborator.service';
import { PublicService } from 'src/app/services/public.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-collaborator',
  templateUrl: './index-collaborator.component.html',
})
export class IndexCollaboratorComponent implements OnInit {
  public collaborators: Array<any> = [];
  public collaborators_arr: Array<any> = [];
  public load_data: boolean = true;
  public filter: string = '';
  public p: number = 1;

  constructor(
    private collaboratorService: CollaboratorService,
    private publicService: PublicService
  ) {}

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this.collaboratorService.read_collaborators().subscribe({
      next: (res) => {
        this.load_data = false;
        this.collaborators = res.data;
        this.collaborators_arr = res.data;
      },
      error: (err) => {
        this.load_data = false;
        console.log(err);
      },
    });
  }

  change_status(id: any, status: any) {
    const word = status ? 'desactivado' : 'activado';
    this.collaboratorService.change_status(id, { status }).subscribe({
      next: () => {
        this.init_data();
        this.publicService.success(`Estado ${word}.`);
      },
    });
  }

  delete_data(id: any, name: any) {
    Swal.fire({
      title: 'Eliminar Colaborador',
      text: `¿Desea eliminar el colaborador ${name}?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.collaboratorService.delete_collaborator(id).subscribe(() => {
          this.init_data();
          this.publicService.success(`Colaborador ${name} eliminado.`);
        });
      }
    });
  }

  search() {
    if (this.filter) {
      var term = new RegExp(this.filter, 'i');
      this.collaborators = this.collaborators_arr.filter(
        (item) =>
          term.test(item.full_name) ||
          term.test(item.email) ||
          term.test(item.dni)
      );
    } else {
      this.collaborators = this.collaborators_arr;
    }
  }
}
