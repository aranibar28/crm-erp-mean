import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-course',
  templateUrl: './index-course.component.html',
})
export class IndexCourseComponent implements OnInit {
  public img_url = environment.img_url;
  public courses: Array<any> = [];
  public load_data: boolean = true;
  public filter: string = '';
  public p: number = 1;

  constructor(public courseService: CourseService) {}

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this.courseService.read_courses().subscribe({
      next: (res) => {
        this.load_data = false;
        this.courses = res.data;
      },
      error: (err) => {
        this.load_data = false;
        console.log(err);
      },
    });
  }

  change_status(id: any, status: any) {
    const word = status ? 'desactivado' : 'activado';
    this.courseService.change_status(id, { status }).subscribe({
      next: () => {
        this.init_data();
        Swal.fire('Listo!', 'Estado ' + word, 'success');
      },
    });
  }

  delete_data(id: any, name: any) {
    Swal.fire({
      icon: 'question',
      title: 'Eliminar Curso',
      text: `¿Desea eliminar el Curso ${name}?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.delete_course(id).subscribe(() => {
          Swal.fire('Listo!', name + ' eliminado.', 'success');
          this.init_data();
        });
      }
    });
  }
}
