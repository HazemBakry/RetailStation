import { Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HrService } from '../../services/hr.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeVacationModel } from '../../models/EmployeeVacationModel';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hr-dashboard',
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css']
})
export class HrDashboardComponent implements OnInit {
  @ViewChild('chartBox') chartBox!: ElementRef<HTMLElement>;
  @ViewChild('DetailsSidePanel', { static: true }) DetailsSidePanel: TemplateRef<any>;
  showLoader: boolean = false;
  parentChartWidth!: number;
  HRStatistics: any;
  workflowStatusId: any;
  employeesVacations: EmployeeVacationModel[] = []
  employeeStatusSelector: GeneralSelectorModel[] = [];
  selectAll: boolean = false;

  constructor(private hrService: HrService,
    private offcanvasService: NgbOffcanvas,
    private toaster: ToastrService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {
    this.getHRDashboardStatistics();
    this.getVacationsToBeExceuted();
  }
  columnChartType = 'ColumnChart';
  columnChartData = [
    ['يناير', 600, 230],
    ['فبراير', 1170, 700],
    ['مارس', 800, 880],
    ['أبريل', 1300, 900],
    ['مايو', 400, 700],
    ['يونيو', 900, 1000],
    ['يوليو', 200, 700],
    ['أغسطس', 1200, 550],
    ['سبتمبر', 470, 789],
    ['أكتوبر', 300, 900],
    ['نوفمبر', 250, 800],
    ['ديسمبر', 500, 1100],
  ];
  columnChartNames = ['الشهور', 'النسب', 'الارقام'];
  columnChartOptions = {
    colors: ['#8dd3c7', '#fbbf72'],
    backgroundColor: 'transparent',
    chartArea: {
      width: '70%',
      backgroundColor: 'transparent',
    },
    hAxis: {
      title: 'الشهور',
    },
    vAxis: {
      title: 'النتائج',
    },
    legend: {
      // position: 'bottom',
      alignment: 'center',
    },
    isStacked: true,
  };
  columnChartWidth = (window.innerWidth * 0.95) / 1.4;
  columnChartHeight = window.innerHeight * 0.4;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.columnChartWidth = (window.innerWidth * 0.95) / 1.4;
    this.columnChartHeight = window.innerHeight * 0.4;
  }

  ngAfterViewInit(): void {
    this.parentChartWidth =
      this.chartBox.nativeElement.getBoundingClientRect().width;
  }

  getHRDashboardStatistics() {
    this.hrService.GetHRDashboardStatistics().subscribe(data => {
      this.HRStatistics = data[0];
    });
  }

  getVacationsToBeExceuted() {
    this.hrService.GetVacationsToBeExceuted().subscribe(data => {
      this.employeesVacations = data.results;
    });
  }
  openPendingVacationsSidePanel(content: any = null) {
    //this.EntryId = journalEntryId;
    // this.hrService.GetVacationsToBeExceuted().subscribe(data => {
    //   this.HRStatistics = data[0];
    // });

    this.lookupService.GetEmployeeStatusSelector().subscribe((data: any[]) => {
      this.employeeStatusSelector = data
    });

    if (content == null)
      this.offcanvasService.open(this.DetailsSidePanel, { panelClass: 'details-panel', position: 'end' });
    else
      this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
  }

  selectAllData() {
    if (this.employeesVacations && this.employeesVacations.length > 0) {
      this.employeesVacations.map(c => {
        c.isChecked = this.selectAll;
      });
    }
  }

  editSelectedEmployeeStatus() {
    const selectedItems = this.employeesVacations.filter(b => b.isChecked).map(i => Number(i.employeeId));;

    //return selectedItems.map(i => Number(i.employeeId));
    if (!selectedItems?.length)
      return;

    this.showLoader = true;
    this.hrService.EditEmployeesWorkStatus(selectedItems).subscribe((data: ActionsResponseModel) => {
      if (data.isSuccess) {
        this.selectAll = false;
        this.getVacationsToBeExceuted();
        this.toaster.success(data.message);
      }
      else {
        this.toaster.error(data.message);
      }
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

}
