import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';
import { DatePipe } from '@angular/common';
import { GeneralAccountSettingsService } from '../../services/general-account-settings.service';

@Component({
  selector: 'app-ledger-journal-type',
  templateUrl: './ledger-journal-type.component.html',
  styleUrls: ['./ledger-journal-type.component.css']
})
export class LedgerJournalTypeComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'أنواع الدفاتر اليومية'];
  LeadgerTypesData: any[] = [];
  formGroup: FormGroup;
  TotalCount = 0;
  LeadgerTypeId: any;
  totalPages: any;
  formErrors = {
    nameAr: ''
  };
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 10,
    filterItems: []
  };

  constructor(private modalService: NgbModal, private toaster: ToastrService, private generalAccountSettingsService: GeneralAccountSettingsService,
    private form: FormBuilder, private _FormService: FormService) { }

  ngOnInit(): void {
    this.buildForm();
    this.GetLedgerJournalTypeData();
  }

  buildForm() {
    this.formGroup = this.form.group({
      id: [null],
      nameAr: [null, [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  fillEditForm(item: any) {
    this.formGroup.patchValue({
      id: item.id,
      nameAr: item.nameAr,
    });
  }

  openItemModal(content: any, item: any) {
    this.formGroup?.reset();
    if (item)
      this.fillEditForm(item);
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  openDeleteItemModal(content: any, id: any) {
    this.LeadgerTypeId = id;
    this.modalService.open(content, { size: 'md', centered: true, scrollable: true });
  }

  GetLedgerJournalTypeData() {
    this.generalAccountSettingsService.GetLedgerJournalTypeData().subscribe(data => {
      this.LeadgerTypesData = data;
    });
  }

  pageChanged(obj: any) {
  }

  AddNewLedgerJournalType() {
    if (!this.validateForm())
      return;

    let formData = this.formGroup.value;
    if (!formData?.id) {
      formData.id = 0;
      this.generalAccountSettingsService.AddNewLedgerJournalType(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.modalService.dismissAll();
          this.GetLedgerJournalTypeData();
          this.toaster.success(data?.message);
        }
        else
          this.toaster.error(data?.message);
      });
    } else {
      this.generalAccountSettingsService.EditLedgerJournalType(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.modalService.dismissAll();
          this.GetLedgerJournalTypeData();
          this.toaster.success(data?.message);
        }
        else
          this.toaster.error(data?.message);
      });
    }
  }

  DeleteLedgerJournalType() {
    this.generalAccountSettingsService.DeleteLedgerJournalType(this.LeadgerTypeId).subscribe(data => {
      if (data?.isSuccess) {
        this.toaster.success(data?.message);
        this.GetLedgerJournalTypeData();
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
