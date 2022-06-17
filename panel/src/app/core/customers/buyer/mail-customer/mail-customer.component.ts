import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { ProspectService } from 'src/app/services/prospect.service';
declare var $: any;

@Component({
  selector: 'app-mail-customer',
  templateUrl: './mail-customer.component.html',
})
export class MailCustomerComponent implements OnInit {
  public id = this.activatedRoute.snapshot.parent?.params['id'];
  public mails: Array<any> = [];
  public initForm = {};
  public config = {};
  public load_data = true;
  public load_btn = false;
  public p: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private prospectService: ProspectService,
    private notify: GlobalService,
    private fb: FormBuilder
  ) {}

  myForm: FormGroup = this.fb.group({
    asunt: [, [Validators.required]],
    container: [, [Validators.required]],
  });

  ngOnInit(): void {
    this.config = { height: 200 };
    this.init_data();
    this.initForm = this.myForm.value;
  }

  init_data() {
    this.prospectService.read_mails(this.id).subscribe({
      next: (res) => {
        this.mails = res.data;
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
    this.prospectService.create_mail(this.myForm.value).subscribe({
      next: () => {
        $('#modalCorreo').modal('hide');
        this.notify.success('Se envió un correo al cliente.');
        this.myForm.reset(this.initForm);
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

  toggleEmail(id: any) {
    var clase = $('#card_' + id).attr('class');
    if (clase == 'card-spacer-x pt-2 pb-5 toggle-off-item') {
      $('#card_' + id).removeClass('toggle-off-item');
      $('#card_' + id).addClass('toggle-on-item');
    } else if (clase == 'card-spacer-x pt-2 pb-5 toggle-on-item') {
      $('#card_' + id).removeClass('toggle-on-item');
      $('#card_' + id).addClass('toggle-off-item');
    }
  }
}
