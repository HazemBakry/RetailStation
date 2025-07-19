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
import { HrEmployeesSalaryAnnualIncreaseReportComponent } from './components/hr-employees-salary-annual-increase-report/hr-employees-salary-annual-increase-report.component';
import { AuthPageGuard } from 'src/app/Auth/authPage.guard';
import { HRSalariesReportComponent } from './components/hr-salaries-report/hr-salaries-report.component';
import { HrJobsComponent } from './components/hr-jobs/hr-jobs.component';
import { HrRegionsComponent } from './components/hr-regions/hr-regions.component';


const routes: Routes = [
  {
    path: '',
    component: HrLayoutComponent,
    children: [
      {
        path: 'home',
        // component: HrHomeComponent
        component: HrDashboardComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'HrDashboard' }
      },
      {
        path: 'employees',
        component: HrEmployeesComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'employees' }
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
        component: HrVacationComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'Vacations' }
      },
      {
        path: 'careers',
        component: HrCareersComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'Careers' }
      },
      // {
      //   path: 'deducts',
      //   component: HrDeductsComponent
      // },
      {
        path: 'attendance-report',
        component: HrAttendanceReportComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'AttendanceReport' }
      },
      {
        path: 'sick-leaves',
        component: HrSickLeaveComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'SickLeaves' }
      },
      {
        path: 'over-time',
        component: HrOverTimeComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'OverTime' }
      },
      {
        path: 'penalty',
        component: HrPenaltyComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'Penalties' }
      },
      {
        path: 'salary',
        // component: HrSalaryComponent
        component: HrEmployeesSalariesComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'Salaries' }
      },
      {
        path: 'loans',
        component: HrLoansComponent,
        canActivate: [AuthPageGuard],
        data: { pageName: 'Loans' }
      },
      {
        path: 'loans-payments',
        component: HrLoansPaymentsComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'LoanPayments' }
      },
      {
        path: 'advances',
        component: HrAdvancesComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'Advances' }
      },
      {
        path: 'advances-payments',
        component: HrAdvancePaymentsComponent,
        // canActivate: [AuthPageGuard],
        data: { pageName: 'AdvancePayments' }
      },
      {
        path: 'employees-report',
        component: HREmployeesReportComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'EmployeesReport' }
      },
      {
        path: 'iqama-report',
        component: HRIqamaReportComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'IqamaReport' }
      },
      {
        path: 'payroll-report',
        component: HRPayrollReportComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'PayrollReport' }
      },
      {
        path: 'expire-report',
        component: HrEmployeeExpireReportComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'ExpireReport' }
      },
      {
        path: 'new-comer-report',
        component: HrNewComerEmployeesReportComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'NewComersReport' }
      },
      {
        path: 'annual-increase-report',
        component: HrEmployeesSalaryAnnualIncreaseReportComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'SalaryAnnualIncreaseReport' }
      },
      {
        path: 'salaries-report',
        component: HRSalariesReportComponent,
        // canActivate: [AuthPageGuard],
        data: { pageName: 'HRSalariesReport' }
      },
      {
        path: 'advances-report',
        component: HrAdvancesReportsComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'AdvancesReport' }
      },
      {
        path: 'employee-dues',
        component: HrEmployeeDuesComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'EmployeeDues' }
      },
      {
        path: 'sponsors',
        component: HrSponsorsComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'Sponsors' }
      },
      {
        path: 'departments',
        component: HrDepartmentsComponent,
        //canActivate: [AuthPageGuard],
        data: { pageName: 'Departments' }
      },
      {
        path: 'jobs',
        component: HrJobsComponent,
        // canActivate: [AuthPageGuard],
        data: { pageName: 'Jobs' }
      },
      {
        path: 'regions',
        component: HrRegionsComponent,
        // canActivate: [AuthPageGuard],
        data: { pageName: 'Regions' }
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
