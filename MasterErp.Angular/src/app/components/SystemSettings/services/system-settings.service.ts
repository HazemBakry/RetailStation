import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilterModel } from '../../Shared/models/FilterModel';
import { UserModel } from '../../Shared/models/UserModel';
import { Observable } from 'rxjs';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingsService {
  URL = environment.apiURL;
  constructor(private http: HttpClient) 
  {
  }


  getUsers(model: PagedResponseDTO):Observable<PagedResponseDTO<UserModel[]>> {
    return this.http.post<PagedResponseDTO<UserModel[]>>(this.URL + 'Auth/GetUsers', model);
  }
}
