import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url;
declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  get id(): string {
    return localStorage.getItem('x-id') || '';
  }

  get user(): string {
    return localStorage.getItem('x-user') || '';
  }

  get token(): string {
    return localStorage.getItem('x-token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  login(data: any): Observable<any> {
    const url = `${base_url}/collaborator/login`;
    return this.http.post(url, data, this.headers);
  }

  logout() {
    localStorage.removeItem('x-id');
    localStorage.removeItem('x-user');
    localStorage.removeItem('x-token');
  }
}
