import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url + '/customer';
declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private title = new BehaviorSubject<String>('App title');
  private title$ = this.title.asObservable();

  setTitle(title: String) {
    this.title.next(title);
  }

  getTitle(): Observable<String> {
    return this.title$;
  }

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

  success(msg: string) {
    $.notify(msg, {
      type: 'success',
      spacing: 10,
      timer: 2000,
      placement: { from: 'top', align: 'right' },
      delay: 1000,
      animate: { enter: 'animated bounce', exit: 'animated bounce' },
    });
  }

  danger(msg: string) {
    $.notify(msg, {
      type: 'danger',
      spacing: 10,
      timer: 2000,
      placement: { from: 'top', align: 'right' },
      delay: 1000,
      animate: { enter: 'animated bounce', exit: 'animated bounce' },
    });
  }

  menu: any[] = [
    {
      title: 'Actividades',
      path: 'prospect',
      class: 'btn btn-danger'
    },
    {
      title: 'Intereses',
      path: 'interest',
      class: 'btn btn-warning'
    },
    {
      title: 'LLamadas',
      path: 'call',
      class: 'btn btn-success'
    },
    {
      title: 'Correos',
      path: 'mail',
      class: 'btn btn-info'
    },
    {
      title: 'Tareas',
      path: 'task',
      class: 'btn btn-dark'
    },
  ];
}
