import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public user: any = undefined;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.logged();
  }

  logged() {
    if (this.authService.user) {
      this.user = JSON.parse(localStorage.getItem('x-user')!);
    } else {
      this.user = undefined;
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
