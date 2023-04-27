import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HrService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  GetIqamaIssuePlaceData() {
    return this.http.get<any>(this.URL + 'Employees/GetIqamaIssuePlaceData');
  }
}
