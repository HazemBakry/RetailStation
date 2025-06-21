import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HrOverTimeComponent } from './components/hr-over-time/hr-over-time.component';
import { HrPenaltyComponent } from './components/hr-penalty/hr-penalty.component';
import { HrSickLeaveComponent } from './components/hr-sick-leave/hr-sick-leave.component';
import { HrSalaryComponent } from './components/hr-salary/hr-salary.component';
import { HrVacationComponent } from './components/hr-vacation/hr-vacation.component';
import { HrRoutingModule } from './hr-routing.module';
import { HrEmployeeDetailsComponent } from './components/hr-employee-details/hr-employee-details.component';
import { HrEmployeesComponent } from './components/hr-employees/hr-employees.component';
import { SharedModule } from "../Shared/shared.module";
import { HrHomeComponent } from './components/hr-home/hr-home.component';
import { HrLayoutComponent } from './hr-layout/hr-layout.component';
import { HrCareersComponent } from './components/hr-careers/hr-careers.component';
import { HrDeductsComponent } from './components/hr-deducts/hr-deducts.component';
import { HrLoansComponent } from './components/hr-loans/hr-loans.component';
import { HrEmployeeDetailsContainerComponent } from './components/hr-employee-details-container/hr-employee-details-container.component';
import { HrEmployeeBasicInfoComponent } from './components/hr-employee-details-container/hr-employee-basic-info/hr-employee-basic-info.component';
import { HrEmployeeContractInfoComponent } from './components/hr-employee-details-container/hr-employee-contract-info/hr-employee-contract-info.component';
import { HrEmployeeVerificationInfoComponent } from './components/hr-employee-details-container/hr-employee-verification-info/hr-employee-verification-info.component';
import { HrEmployeeAttachmentsComponent } from './components/hr-employee-details-container/hr-employee-attachments/hr-employee-attachments.component';
import { HrLoansPaymentsComponent } from './components/hr-loans-payments/hr-loans-payments.component';
import { HREmployeesReportComponent } from './components/hr-employees-report/hr-employees-report.component';
import { HRIqamaReportComponent } from './components/hr-iqama-report/hr-iqama-report.component';
import { HRPayrollReportComponent } from './components/hr-payroll-report/hr-payroll-report.component';
import { HrDashboardComponent } from './components/hr-dashboard/hr-dashboard.component';
import { HrAttendanceReportComponent } from './components/hr-attendance-report/hr-attendance-report.component';
import { HrAdvancesComponent } from './components/hr-advances/hr-advances.component';
import { HrAdvancePaymentsComponent } from './components/hr-advance-payments/hr-advance-payments.component';
import { HrAdvancesReportsComponent } from './components/hr-advances-reports/hr-advances-reports.component';
import { HrAttendanceAdvancedReportComponent } from './components/hr-attendance-report/hr-attendance-advanced-report/hr-attendance-advanced-report.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HrDailyAttendanceReportComponent } from './components/hr-attendance-report/hr-daily-attendance-report/hr-daily-attendance-report.component';
import { HrEmployeesSalariesComponent } from './components/hr-employees-salaries/hr-employees-salaries.component';
import { HrEmployeeDuesComponent } from './components/hr-employee-dues/hr-employee-dues.component';
import { HrMiniEmployeeContractInfoComponent } from './components/hr-mini-employee-contract-info/hr-mini-employee-contract-info.component';

@NgModule({
  declarations: [
    HrVacationComponent,
    HrOverTimeComponent,
    HrPenaltyComponent,
    HrSickLeaveComponent,
    HrSalaryComponent,
    HrEmployeesComponent,
    HrEmployeeDetailsComponent,
    HrHomeComponent,
    HrLayoutComponent,
    HrCareersComponent,
    HrDeductsComponent,
    HrLoansComponent,
    HrLoansPaymentsComponent,
    HrEmployeeDetailsContainerComponent,
    HrEmployeeBasicInfoComponent,
    HrEmployeeContractInfoComponent,
    HrEmployeeVerificationInfoComponent,
    HrEmployeeAttachmentsComponent,
    HREmployeesReportComponent,
    HRIqamaReportComponent,
    HRPayrollReportComponent,
    HrDashboardComponent,
    HrAttendanceReportComponent,
    HrAdvancesComponent,
    HrAdvancePaymentsComponent,
    HrAdvancesReportsComponent,
    HrDailyAttendanceReportComponent,
    HrAttendanceAdvancedReportComponent,
    HrEmployeesSalariesComponent,
    HrEmployeeDuesComponent,
    HrMiniEmployeeContractInfoComponent,
  ],
  imports: [
    HrRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
],
  providers:[DatePipe]
})
export class HrModule { }
