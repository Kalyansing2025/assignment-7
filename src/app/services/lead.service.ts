import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  public baseUrl = "http://localhost:3000/leads";

  constructor(private http: HttpClient) { }
  getLeads(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addLead(lead: any): Observable<any> {
    return this.http.post(this.baseUrl, lead);
  }

  updateLead(id: number, lead: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, lead);
  }

  deleteLead(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
