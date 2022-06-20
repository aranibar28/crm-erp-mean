import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-index-cycle',
  templateUrl: './index-cycle.component.html',
})
export class IndexCycleComponent implements OnInit {
  public img_url = environment.img_url;
  public load_data: boolean = true;
  public load_btn: boolean = false;
  public data: boolean = false;
  public id: any;
  public course: any = {};
  public cycles: Array<any> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private router: Router
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
          this.list_cycles();
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

  list_cycles() {
    this.courseService.read_cycles(this.id).subscribe({
      next: (res) => {
        this.cycles = res.data;
      },
    });
  }
}
