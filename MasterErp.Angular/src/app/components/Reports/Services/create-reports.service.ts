import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { SearchReportModel } from '../Models/ReportParams';

@Injectable({
  providedIn: 'root'
})
export class CreateReportsService {
  URL = environment.apiURL;

  constructor(private http: HttpClient, private toaster: ToastrService) { }

  CreateGeneralReport(model: SearchReportModel, callback?: (timeTaken: number) => void) {
    const startTime = Date.now();
    return this.http.post<any>(this.URL + 'CreateReport/CreateGeneralReport', model).subscribe({
      next: (response) => {
        const endTime = Date.now();
        const timeTaken = Math.floor(endTime - startTime) / 1000;
        if (response && response.filePath) {
          const newTab = window.open(response.filePath, '_blank');
          const interval = setInterval(() => {
            if (newTab?.closed) {
              clearInterval(interval);
              let fileName = response.filePath.split('/').pop();
              this.DeleteReportPdfFile(fileName);
            }
          }, 1000);
        }
        else
          this.toaster.error('En Error Happened!');

        if (callback) callback(timeTaken);
      },
      error: () => {
        const endTime = Date.now();
        const timeTaken = Math.floor(endTime - startTime) / 1000;
        this.toaster.error('En Error Happened!');
        if (callback) callback(timeTaken);
      }
    });
  }

  DeleteReportPdfFile(FileName: string) {
    return this.http.get<any>(this.URL + 'CreateReport/DeleteReportPdfFile?FileName=' + FileName).subscribe();
  }

  GetCreateReportData(Model: SearchReportModel): Observable<any> {
    const url = `${this.URL}${Model.ControllerName}/${Model.ApiName}`;

    let httpOptions: any = {
      params: new HttpParams()
    };

    if (Model.MethodType === 'GET') {
      if (Model.filterItems.length > 0) {
        Model.filterItems.forEach(item => {
          if (item)
            httpOptions.params = httpOptions.params.set(item.categoryName, item.itemFlag);
        });
      }
      return this.http.get<any>(url, httpOptions);
    }

    else if (Model.MethodType === 'POST') {
      let paramBody = {
        currentPage: 1,
        pageSize: 999900
      }
      Model.filterItems.forEach(item => {
        if (item)
          paramBody[item.categoryName] = item.itemFlag;
      });

      return this.http.post<any>(url, paramBody || {}, httpOptions);
    }
  }

  GetReportJsonKeys() {
    return this.http.get<any>('../../../../assets/Reports/ReportKeys-ar.json')
  }
}
