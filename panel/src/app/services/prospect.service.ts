import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url + '/prospect';

@Injectable({
  providedIn: 'root',
})
export class ProspectService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('x-token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_call(data: any): Observable<any> {
    const url = `${base_url}/create_call`;
    return this.http.post(url, data, this.headers);
  }

  read_calls(id: any): Observable<any> {
    const url = `${base_url}/read_calls/${id}`;
    return this.http.get(url, this.headers);
  }
}
