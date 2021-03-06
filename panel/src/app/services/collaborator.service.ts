import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url + '/collaborator';

@Injectable({
  providedIn: 'root',
})
export class CollaboratorService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('x-token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_collaborator(data: any): Observable<any> {
    const url = `${base_url}/create`;
    return this.http.post(url, data, this.headers);
  }

  read_collaborators(): Observable<any> {
    const url = `${base_url}/read`;
    return this.http.get(url, this.headers);
  }

  read_collaborator_by_id(id: any): Observable<any> {
    const url = `${base_url}/read/${id}`;
    return this.http.get(url, this.headers);
  }

  update_collaborator(id: any, data: any): Observable<any> {
    const url = `${base_url}/update/${id}`;
    return this.http.put(url, data, this.headers);
  }

  delete_collaborator(id: any): Observable<any> {
    const url = `${base_url}/delete/${id}`;
    return this.http.delete(url, this.headers);
  }

  change_status(id: any, data: any): Observable<any> {
    const url = `${base_url}/status/${id}`;
    return this.http.put(url, data, this.headers);
  }

  list_advisors(): Observable<any> {
    const url = `${base_url}/list_advisors`;
    return this.http.get(url, this.headers);
  }

  list_instructors(): Observable<any> {
    const url = `${base_url}/list_instructors`;
    return this.http.get(url, this.headers);
  }
}
