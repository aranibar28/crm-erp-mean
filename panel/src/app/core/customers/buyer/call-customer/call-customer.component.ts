import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { ProspectService } from 'src/app/services/prospect.service';
declare var $: any;

@Component({
  selector: 'app-call-customer',
  templateUrl: './call-customer.component.html',
})
export class CallCustomerComponent implements OnInit {
  public load_data = true;
  public load_btn = false;
  public calls: Array<any> = [];
  public id: any;
  public p: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private prospectService: ProspectService,
    private notify: GlobalService,
    private fb: FormBuilder
  ) {
    this.id = this.activatedRoute.snapshot.parent?.params['id'];
  }

  myForm: FormGroup = this.fb.group({
    date: [, [Validators.required]],
    time: [, [Validators.required]],
    result: ['', [Validators.required]],
    note: [,],
  });

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this.prospectService.read_calls(this.id).subscribe({
      next: (res) => {
        this.calls = res.data;
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
    this.prospectService.create_call(this.myForm.value).subscribe({
      next: () => {
        $('#modalLlamada').modal('hide');
        this.notify.success('Datos Guardados');
        this.load_btn = false;
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
