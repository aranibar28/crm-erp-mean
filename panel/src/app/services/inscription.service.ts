import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url + '/inscriptions';

@Injectable({
  providedIn: 'root',
})
export class InscriptionService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('x-token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_inscription(data: any): Observable<any> {
    const url = `${base_url}/create_inscription`;
    return this.http.post(url, data, this.headers);
  }

  read_inscriptions_today(): Observable<any> {
    const url = `${base_url}/read_inscriptions_today`;
    return this.http.get(url, this.headers);
  }

  read_inscriptions_dates(advisor: any, from: any, to: any): Observable<any> {
    const url = `${base_url}/read_inscriptions_dates/${advisor}/${from}/${to}`;
    return this.http.get(url, this.headers);
  }
}