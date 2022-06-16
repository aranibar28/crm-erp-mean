import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CollaboratorService } from 'src/app/services/collaborator.service';
import { GlobalService } from 'src/app/services/global.service';
import { ProspectService } from 'src/app/services/prospect.service';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-task-customer',
  templateUrl: './task-customer.component.html',
})
export class TaskCustomerComponent implements OnInit {
  public date = new Date();
  public load_data = true;
  public load_btn = false;
  public advisors: Array<any> = [];
  public tasks: Array<any> = [];
  public id: any;
  public p: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private collaboratorService: CollaboratorService,
    private prospectService: ProspectService,
    private notify: GlobalService,
    private fb: FormBuilder
  ) {
    this.id = this.activatedRoute.snapshot.parent?.params['id'];
  }

  myForm: FormGroup = this.fb.group({
    title: [, [Validators.required]],
    date: [, [Validators.required]],
    time: ['12:00', [Validators.required]],
    type: ['', [Validators.required]],
    priority: ['', [Validators.required]],
    note: [, [Validators.required]],
    advisor: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.init_advisors();
    this.init_data();
  }

  init_advisors() {
    this.collaboratorService.list_advisors().subscribe({
      next: (res) => (this.advisors = res.data),
    });
  }

  init_data() {
    this.prospectService.read_tasks(this.id).subscribe({
      next: (res) => {
        this.tasks = res.data;
        this.load_data = false;
      },
    });
  }

  register() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.load_btn = true;
    this.myForm.addControl('customer', this.fb.control(this.id));
    this.prospectService.create_task(this.myForm.value).subscribe({
      next: () => {
        $('#modalTarea').modal('hide');
        this.notify.success('Se guardaron los datos.');
        this.load_btn = false;
        this.myForm.reset();
        this.init_data();
      },
      error: (err) => {
        this.notify.success(err.msg);
        this.load_btn = false;
      },
    });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
