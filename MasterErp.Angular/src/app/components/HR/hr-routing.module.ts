import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrEmployeesComponent } from './components/hr-employees/hr-employees.component';
import { HrVacationComponent } from './components/hr-vacation/hr-vacation.component';
import { HrOverTimeComponent } from './components/hr-over-time/hr-over-time.component';
import { HrSickLeaveComponent } from './components/hr-sick-leave/hr-sick-leave.component';
import { HrPenaltyComponent } from './components/hr-penalty/hr-penalty.component';
import { HrSalaryComponent } from './components/hr-salary/hr-salary.component';
import { HrEmployeeDetailsComponent } from './components/hr-employee-details/hr-employee-details.component';
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
import { HrEmployeesSalariesComponent } from './components/hr-employees-salaries/hr-employees-salaries.component';
import { HrEmployeeDuesComponent } from './components/hr-employee-dues/hr-employee-dues.component';
import { HrSponsorsComponent } from './components/hr-sponsors/hr-sponsors.component';
import { HrDepartmentsComponent } from './components/hr-departments/hr-departments.component';
import { HrEmployeeExpireReportComponent } from './components/hr-employee-expire-report/hr-employee-expire-report.component';
import { HrEmployeeContractSalaryComponent } from './components/hr-employee-details-container/hr-employee-contract-salary/hr-employee-contract-salary.component';
import { HrNewComerEmployeesReportComponent } from './components/hr-new-comer-employees-report/hr-new-comer-employees-report.component';


const routes: Routes = [
  {
    path: '',
    component: HrLayoutComponent,
    children: [
      {
        path: 'home',
        // component: HrHomeComponent
        component: HrDashboardComponent
      },
      {
        path: 'employees',
        component: HrEmployeesComponent
      },
      {
        path: 'employee',
        component: HrEmployeeDetailsComponent
      },
      {
        path: 'employee-details',
        component: HrEmployeeDetailsContainerComponent,
        children: [
          {
            path: 'basic-info',
            component: HrEmployeeBasicInfoComponent
          },
          {
            path: 'contract-info',
            component: HrEmployeeContractInfoComponent
          },
          {
            path: 'contract-salary',
            component: HrEmployeeContractSalaryComponent
          },
          {
            path: 'verification-info',
            component: HrEmployeeVerificationInfoComponent
          },
          {
            path: 'attachments',
            component: HrEmployeeAttachmentsComponent
          },
          { path: '', redirectTo: 'basic-info', pathMatch: 'full' },
        ]

      },
      {
        path: 'vacations',
        component: HrVacationComponent
      },
      {
        path: 'careers',
        component: HrCareersComponent
      },
      // {
      //   path: 'deducts',
      //   component: HrDeductsComponent
      // },
      {
        path: 'attendance-report',
        component: HrAttendanceReportComponent
      },
      {
        path: 'sick-leaves',
        component: HrSickLeaveComponent
      },
      {
        path: 'over-time',
        component: HrOverTimeComponent
      },
      {
        path: 'penalty',
        component: HrPenaltyComponent
      },
      {
        path: 'salary',
        // component: HrSalaryComponent
        component: HrEmployeesSalariesComponent
      },
      {
        path: 'loans',
        component: HrLoansComponent
      },
      {
        path: 'loans-payments',
        component: HrLoansPaymentsComponent
      },
      {
        path: 'advances',
        component: HrAdvancesComponent
      },
      {
        path: 'advances-payments',
        component: HrAdvancePaymentsComponent
      },
      {
        path: 'employees-report',
        component: HREmployeesReportComponent
      },
      {
        path: 'iqama-report',
        component: HRIqamaReportComponent
      },
      {
        path: 'payroll-report',
        component: HRPayrollReportComponent
      },
      {
        path: 'expire-report',
        component: HrEmployeeExpireReportComponent
      },
      {
        path: 'new-comer-report',
        component: HrNewComerEmployeesReportComponent
      },
      {
        path: 'advances-report',
        component: HrAdvancesReportsComponent
      },
      {
        path: 'employee-dues',
        component: HrEmployeeDuesComponent
      },
      {
        path: 'sponsors',
        component: HrSponsorsComponent
      },
      {
        path: 'departments',
        component: HrDepartmentsComponent
      },
      
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
