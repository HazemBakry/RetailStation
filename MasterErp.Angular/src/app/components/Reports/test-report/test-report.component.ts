import { Component, OnInit } from '@angular/core';
import { CreateReportsService } from '../Services/create-reports.service';

@Component({
  selector: 'app-test-report',
  templateUrl: './test-report.component.html',
  styleUrls: ['./test-report.component.css']
})
export class TestReportComponent implements OnInit {
  tableData: any[] = [
    { name: "tamer abo moaty", count: 5, value1: 490.00, value2: 21.00, value3: 0.00, total: 511.00, tax: 63.91, finalTotal: 511.00, value4: 490.00, value5: 490.00 },
    { name: "Taif Saleh", count: 1, value1: 34.00, value2: 0.00, value3: 0.00, total: 34.00, tax: 4.43, finalTotal: 34.00, value4: 0.00, value5: 34.00 },
    { name: "MOHAMED EBRAHIM CASHIER", count: 7, value1: 581.00, value2: 14.00, value3: 0.00, total: 595.00, tax: 75.79, finalTotal: 595.00, value4: 581.00, value5: 581.00 },
    { name: "Almaha Saleh", count: 4, value1: 521.00, value2: 14.00, value3: 0.00, total: 535.00, tax: 67.96, finalTotal: 535.00, value4: 521.00, value5: 521.00 },
    { name: "MAHMOUD FATHI", count: 4, value1: 372.00, value2: 28.00, value3: 0.00, total: 400.00, tax: 48.52, finalTotal: 400.00, value4: 0.00, value5: 372.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
    { name: "yosif mohamed", count: 4, value1: 337.00, value2: 14.00, value3: 0.00, total: 351.00, tax: 43.97, finalTotal: 351.00, value4: 337.00, value5: 337.00 },
  ];
  constructor(private ReportsService: CreateReportsService) { }

  ngOnInit(): void {
  }

  CreateTestReport() {
    this.ReportsService.CreateTestReport().subscribe((data) => {
      if (data && data.filePath)
        window.open(data.filePath, '_blank');
      else
        alert('En Error Happened!');
    });
  }

}
