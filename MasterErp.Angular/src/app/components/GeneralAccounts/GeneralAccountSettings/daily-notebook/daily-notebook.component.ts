import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralAccountSettingsService } from '../../services/general-account-settings.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-daily-notebook',
  templateUrl: './daily-notebook.component.html',
  styleUrls: ['./daily-notebook.component.css']
})
export class DailyNotebookComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'الدفاتر اليومية'];
  DailyNotebooks: any[] = [];
  LeadgerTypes = [];
  formGroup: FormGroup;
  TotalCount = 0;
  DailyNotebookId: any;
  totalPages: any;
  formErrors = {
    dailyNotebookName: '',
    leadgerTypeId: '',
    code: '',
    virtualAccount: ''
  };
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterItems: []
  };

  constructor(private modalService: NgbModal, private toaster: ToastrService,
    private form: FormBuilder, private _FormService: FormService, private generalAccountSettingsService: GeneralAccountSettingsService) { }

  ngOnInit(): void {
    this.buildForm();
    this.GetDailyNotebookData();
    this.GetLedgerJournalTypeData();
  }

  buildForm() {
    this.formGroup = this.form.group({
      dailyNotebookId: [null],
      dailyNotebookName: [null, [Validators.required]],
      leadgerTypeId: [null, [Validators.required]],
      code: [null, [Validators.required]],
      virtualAccount: [null, [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  fillEditForm(item: any) {
    this.formGroup.patchValue({
      dailyNotebookId: item.dailyNotebookId,
      dailyNotebookName: item.dailyNotebookName,
      leadgerTypeId: item.leadgerTypeId,
      code: item.code,
      virtualAccount: item.virtualAccount
    });
  }

  openItemModal(content: any, item: any) {
    if (item)
      this.fillEditForm(item);
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  openDeleteItemModal(content: any, id: any) {
    this.DailyNotebookId = id;
    this.modalService.open(content, { size: 'md', centered: true, scrollable: true });
  }


  GetDailyNotebookData() {
    this.generalAccountSettingsService.GetDailyNotebookData(this.FilterModel).subscribe(data => {
      this.DailyNotebooks = data;
      this.TotalCount = data && data.length > 0 && data[0].totalCount ? data[0].totalCount : 0;
    });
  }

  GetLedgerJournalTypeData() {
    this.generalAccountSettingsService.GetLedgerJournalTypeData().subscribe(data => {
      this.LeadgerTypes = data;
      this.LeadgerTypes = this.LeadgerTypes.map(i => { return { name: i.nameAr, value: i.id } });
    });
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
  }

  AddNewDailyNotebook() {
    if (!this.validateForm())
      return;
    let formData = this.formGroup.value;

    if (!formData?.dailyNotebookId) {
      formData.dailyNotebookId = 0;
      this.generalAccountSettingsService.AddNewDailyNotebook(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.modalService.dismissAll();
          this.GetDailyNotebookData();
          this.toaster.success(data?.message);
        }
        else
          this.toaster.error(data?.message);
      });
    } else {
      this.generalAccountSettingsService.EditDailyNotebook(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.modalService.dismissAll();
          this.GetDailyNotebookData();
          this.toaster.success(data?.message);
        }
        else
          this.toaster.error(data?.message);
      });
    }
  }

  DeleteDailyNotebook() {
    this.generalAccountSettingsService.DeleteDailyNotebook(this.DailyNotebookId).subscribe(data => {
      if (data?.isSuccess) {
        this.toaster.success(data?.message);
        this.GetDailyNotebookData();
        this.modalService.dismissAll();
      }
      else
        this.toaster.error(data?.message);
    });
  }

  validateForm(): boolean {
    this._FormService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) {
      return true;
    } else {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, false)
      return false;
    }
  }
}
