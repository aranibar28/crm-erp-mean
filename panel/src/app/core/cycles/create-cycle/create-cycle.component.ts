import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-create-cycle',
  templateUrl: './create-cycle.component.html',
})
export class CreateCycleComponent implements OnInit {
  @ViewChild('myForm') myForm!: NgForm;
  public date = new Date();
  public load_data: boolean = true;
  public load_btn: boolean = false;
  public data: boolean = false;

  public id: any;
  public course: any = {};
  public cycle: any = { nivel: '', sede: '' };
  public room: any = { room: '', start_time: '08:00', end_time: '09:45' };

  public days: Array<any> = [];
  public rooms: Array<any> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
  }

  init_data() {
    this.courseService.read_course_by_id(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.course = res.data;
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

  register() {
    if (this.myForm.invalid) {
      this.myForm.control.markAllAsTouched();
      return;
    }
    this.load_btn = true;
    setTimeout(() => {
      this.load_btn = false;
      this.cycle.course = this.id;
      this.cycle.frequency = this.rooms;
      Swal.fire('Listo!', 'Datos Guardados', 'success');
      console.log(this.cycle);
    }, 2000);
  }

  add_item() {
    this.room.frequency = this.days;
    this.rooms.push(this.room);
    this.room = { room: '', start_time: '08:00', end_time: '09:45' };
    this.days = [];
    $('.custom-control-input').prop('checked', false);
  }

  del_item(index: any) {
    this.rooms.splice(index, 1);
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

  validators(name: string) {
    const input = this.myForm?.controls[name];
    return input?.errors && input?.touched;
  }
}
