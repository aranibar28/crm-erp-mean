import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CollaboratorService } from 'src/app/services/collaborator.service';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-create-collaborator',
  templateUrl: './create-collaborator.component.html',
})
export class CreateCollaboratorComponent implements OnInit {
  public load_btn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private collaboratorService: CollaboratorService,
    private publicService: PublicService,
    private router: Router
  ) {}

  ngOnInit(): void {}

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

  register() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.load_btn = true;
    this.collaboratorService.create_collaborator(this.myForm.value).subscribe({
      next: (res) => {
        if (res.data) {
          this.load_btn = false;
          this.publicService.success('Datos guardados correctamente.');
          this.router.navigateByUrl('/dashboard/collaborator');
        } else {
          this.load_btn = false;
          this.publicService.danger(res.msg);
        }
      },
      error: (err) => {
        this.load_btn = false;
        this.publicService.danger(err.msg);
      },
    });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
