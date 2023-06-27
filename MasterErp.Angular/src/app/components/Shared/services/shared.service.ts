import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  //================================== AccountTree ===============================

  GetAccountTreeData(SearchText: string) {
    return this.http.get<any>(this.URL + 'AccountTree/GetAccountTreeData?SearchText=' + SearchText);
  }

  //================================== CostCenterTree ===============================

  GetCostCenterTreeData() {
    return this.http.get<any>(this.URL + 'CostCenterTree/GetCostCenterTreeData');
  }
}
