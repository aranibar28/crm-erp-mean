import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CourseService } from 'src/app/services/course.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-update-cycle',
  templateUrl: './update-cycle.component.html',
  styles: [],
})
export class UpdateCycleComponent implements OnInit {
  @ViewChild('myForm') myForm!: NgForm;
  public date = new Date();
  public load_data: boolean = true;
  public load_btn: boolean = false;
  public data: boolean = false;

  public id: any;
  public id_cycle: any;
  public course: any = {};
  public cycle: any = { nivel: '', sede: '' };
  public room: any = { room: '', start_time: '08:00', final_time: '09:45' };

  public days: Array<any> = [];
  public rooms: Array<any> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
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
  }

  init_data() {
    this.courseService.read_cycle_by_id(this.id, this.id_cycle).subscribe({
      next: (res) => {
        console.log(res);
        if (res.data) {
          this.course = res.data;
          this.cycle = res.cycle;
          this.rooms = res.rooms;
          this.load_data = false;
          this.data = true;
        } else {
          this.load_data = false;
          this.data = false;
        }
      },
      error: (err) => {
        console.log(err);
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
          console.log(res);
          this.rooms.push(this.room);
          this.days = [];
          this.room = { room: '', start_time: '08:00', final_time: '09:45' };
          $('.custom-control-input').prop('checked', false);
        },
      });
    }
  }

  del_item(index: any) {
    //this.rooms.splice(index, 1);
  }

  validators(name: string) {
    const input = this.myForm?.controls[name];
    return input?.errors && input?.touched;
  }
}
