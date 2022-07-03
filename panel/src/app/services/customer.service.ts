import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url + '/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('x-token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_customer(data: any): Observable<any> {
    const url = `${base_url}/create`;
    return this.http.post(url, data, this.headers);
  }

  read_customers(filter: any): Observable<any> {
    const url = `${base_url}/read_customers/${filter}`;
    return this.http.get(url, this.headers);
  }

  read_customer_by_id(id: any): Observable<any> {
    const url = `${base_url}/read/${id}`;
    return this.http.get(url, this.headers);
  }

  update_customer(id: any, data: any): Observable<any> {
    const url = `${base_url}/update/${id}`;
    return this.http.put(url, data, this.headers);
  }

  delete_customer(id: any): Observable<any> {
    const url = `${base_url}/delete/${id}`;
    return this.http.delete(url, this.headers);
  }

  change_status(id: any, data: any): Observable<any> {
    const url = `${base_url}/status/${id}`;
    return this.http.put(url, data, this.headers);
  }

  confirm_email_verify(token: any): Observable<any> {
    const url = `${base_url}/confirm_email_verify/${token}`;
    return this.http.get(url, this.headers);
  }

  list_customers(filter: any): Observable<any> {
    const url = `${base_url}/read_customers/${filter}`;
    return this.http.get(url, this.headers);
  }

  generate_token(inscription: any, customer: any): Observable<any> {
    const url = `${base_url}/generate_token/${inscription}/${customer}`;
    return this.http.get(url, this.headers);
  }

  send_survey(data: any): Observable<any> {
    const url = `${base_url}/send_survey`;
    return this.http.post(url, data, this.headers);
  }

  read_survey(id: any): Observable<any> {
    const url = `${base_url}/read_survey/${id}`;
    return this.http.get(url, this.headers);
  }
}
