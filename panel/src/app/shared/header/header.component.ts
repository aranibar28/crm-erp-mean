import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public user: any = undefined;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.is_logged();
  }

  is_logged() {
    if (this.authService.user) {
      this.user = JSON.parse(localStorage.getItem('x-user')!);
    } else {
      this.user = undefined;
    }
  }

  logout() {
    Swal.fire({
      text: '¿Desea cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigateByUrl('/login');
      }
    });
  }
}
