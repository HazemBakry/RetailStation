import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralAccountService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  //================================== AccountTree ===============================

}
