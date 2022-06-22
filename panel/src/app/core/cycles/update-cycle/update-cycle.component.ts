import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CourseService } from 'src/app/services/course.service';
import Swal from 'sweetalert2';
import { CollaboratorService } from 'src/app/services/collaborator.service';
declare var $: any;

@Component({
  selector: 'app-update-cycle',
  templateUrl: './update-cycle.component.html',
  styles: ['.modal-body{max-height:400px; overflow:auto;}'],
})
export class UpdateCycleComponent implements OnInit {
  @ViewChild('myForm') myForm!: NgForm;
  public date = new Date();
  public load_data: boolean = true;
  public load_btn: boolean = false;
  public data: boolean = false;
  public filter = '';

  public id: any;
  public id_cycle: any;
  public course: any = {};
  public cycle: any = { nivel: '', sede: '' };
  public room: any = { room: '', start_time: '08:00', final_time: '09:45' };
  public instructor_room: any = { cycle_room: '' };

  public days: Array<any> = [];
  public rooms: Array<any> = [];

  public instructors: Array<any> = [];
  public instructors_arr: Array<any> = [];
  public instructors_rooms: Array<any> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private collaboratorService: CollaboratorService,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: ({ id, cycle }) => {
        this.id = id;
        this.id_cycle = cycle;
      },
    });
    this.init_data();
    this.init_instructors_room();
  }

  init_data() {
    this.courseService.read_cycle_by_id(this.id, this.id_cycle).subscribe({
      next: (res) => {
        if (res.data) {
          this.data = true;
          this.course = res.data;
          this.cycle = res.cycle;
          this.rooms = res.rooms;
          this.load_data = false;
          this.init_instructors();
        } else {
          this.data = false;
          this.load_data = false;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  init_instructors() {
    this.collaboratorService.list_instructors().subscribe({
      next: (res) => {
        this.instructors = res.data;
        this.instructors_arr = res.data;
      },
    });
  }

  init_instructors_room() {
    this.courseService.list_instructors_room(this.id_cycle).subscribe({
      next: (res) => {
        this.instructors_rooms = res.data;
      },
    });
  }

  update() {
    if (this.myForm.invalid) {
      this.myForm.control.markAllAsTouched();
      return;
    }
    this.load_btn = true;
    setTimeout(() => {
      this.courseService.update_cycle(this.id_cycle, this.cycle).subscribe({
        next: (res) => {
          console.log(res);
          this.load_btn = false;
          this.router.navigate(['/dashboard/courses/' + this.id + '/cycles']);
          Swal.fire('Listo!', 'Datos Guardados', 'success');
        },
      });
    }, 1000);
  }

  select_day($event: any) {
    let status = $event.currentTarget.checked;
    let value = $event.target.value;
    if (status) {
      this.days.push(value);
    } else {
      this.days.forEach((element, index) => {
        if (element == value) {
          this.days.splice(index, 1);
        }
      });
    }
  }

  add_item() {
    if (!this.room.room) {
      Swal.fire('Error', 'Debe seleccionar un salón.', 'error');
    } else if (!this.room.aforo || this.room.aforo <= 0) {
      Swal.fire('Error', 'Debe ingresar un aforo válido.', 'error');
    } else if (!this.room.start_time || !this.room.final_time) {
      Swal.fire('Error', 'Debe ingresar un fecha.', 'error');
    } else if (this.days?.length <= 0) {
      Swal.fire('Error', 'Debe seleccionar por lo menos un día.', 'error');
    } else {
      this.room.course = this.id;
      this.room.cycle_course = this.id_cycle;
      this.room.frequency = this.days;
      this.courseService.add_rooms_cycle(this.room).subscribe({
        next: (res) => {
          this.init_data();
          this.days = [];
          this.room = { room: '', start_time: '08:00', final_time: '09:45' };
          $('.custom-control-input').prop('checked', false);
          Swal.fire('Listo!', 'Salón agregado correctamente.', 'success');
        },
      });
    }
  }

  delete_room(id: any, name: any) {
    Swal.fire({
      icon: 'question',
      title: 'Eliminar Salón',
      text: `¿Desea eliminar el ${name}?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.del_rooms_cycle(id).subscribe(() => {
          Swal.fire('Listo!', name + ' eliminado.', 'success');
          this.init_data();
        });
      }
    });
  }

  search() {
    if (this.filter) {
      var term = new RegExp(this.filter, 'i');
      this.instructors = this.instructors_arr.filter(
        (item) => term.test(item.full_name) || term.test(item.email)
      );
    } else {
      this.instructors = this.instructors_arr;
    }
  }

  select_instructor(item: any) {
    this.instructor_room.collaborator = item._id;
    $('#inp_instructor').val(item.full_name);
    $('#modalDocente').modal('hide');
  }

  add_instructor() {
    this.instructor_room.cycle_course = this.id_cycle;
    if (!this.instructor_room.cycle_room) {
      Swal.fire('Error', 'Debe seleccionar un salón.', 'error');
    } else if (!this.instructor_room.collaborator) {
      Swal.fire('Error', 'Debe seleccionar un instructor.', 'error');
    } else {
      this.courseService.add_instructor_room(this.instructor_room).subscribe({
        next: () => {
          this.instructor_room.collaborator = '';
          this.instructor_room.cycle_room = '';
          $('#inp_instructor').val('');
          this.init_instructors_room();
          Swal.fire('Error', 'Se agregó correctamente los datos', 'success');
        },
      });
    }
  }

  delete_instructor(item: any) {
    const name = item.collaborator.full_name;
    Swal.fire({
      icon: 'question',
      title: 'Retirar Instructor',
      text: `¿Desea retirar el instructor ${name}?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.del_instructor_room(item._id).subscribe(() => {
          this.init_instructors_room();
          Swal.fire('Listo!', name + ' retirado.', 'success');
        });
      }
    });
  }

  validators(name: string) {
    const input = this.myForm?.controls[name];
    return input?.errors && input?.touched;
  }
}
