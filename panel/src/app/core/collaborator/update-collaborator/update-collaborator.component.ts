import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaboratorService } from 'src/app/services/collaborator.service';
declare var $: any;

@Component({
  selector: 'app-update-collaborator',
  templateUrl: './update-collaborator.component.html',
})
export class UpdateCollaboratorComponent implements OnInit {
  public collaborator: any = {};
  public load_data: boolean = true;
  public load_btn: boolean = false;
  public id: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private collaboratorService: CollaboratorService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
  }

  myForm: FormGroup = this.fb.group({
    first_name: [, [Validators.required, Validators.minLength(3)]],
    last_name: [, [Validators.required, Validators.minLength(3)]],
    email: [, [Validators.required, Validators.email]],
    password: [, [Validators.required, Validators.minLength(3)]],
    role: ['', [Validators.required]],
    dni: [,],
    phone: [,],
    genre: [''],
    country: [''],
  });

  init_data() {
    this.collaboratorService.read_collaborator_by_id(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.collaborator = res.data;
          this.myForm.patchValue(this.collaborator);
        } else {
          this.router.navigateByUrl('/dashboard/collaborator');
        }
      },
      error: (err) => console.log(err),
    });
  }

  update() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    if ($('#input_password').val() == '') {
      this.myForm.controls['password'].setValue(this.collaborator.password);
    } else {
      this.myForm.controls['password'].setValue($('#input_password').val());
    }

    this.load_btn = true;
    this.collaboratorService
      .update_collaborator(this.id, this.myForm.value)
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.load_btn = false;
            this.router.navigateByUrl('/dashboard/collaborator');
            this.collaboratorService.success('Se guardó correctamente');
          } else {
            this.load_btn = false;
            this.collaboratorService.danger(res.msg);
          }
        },
        error: (err) => {
          this.load_btn = false;
          this.collaboratorService.danger(err.msg);
        },
      });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
