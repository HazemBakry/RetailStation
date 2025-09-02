import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { CustomersService } from '../../services/customers.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { GeneralAccountSettingsService } from '../../services/general-account-settings.service';
import { DatePipe } from '@angular/common';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css']
})
export class BatchesComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'الدفعات'];
  Batches: any[] = [];
  Customers: any[] = [];
  leadgerJournals: any[] = [];
  leadgerJournalsSelector:GeneralSelectorModel[]=[];
  PaymentMethods = [{ name: 'نقدي', value: 'نقدي' }, { name: 'حساب بنكي', value: 'حساب بنكي' }];
  formGroup: FormGroup;
  TotalCount = 0;
  BatchId: any;
  totalPages: any;
  formErrors = {
    nameAr: '',
    batchType: '',
    customerId: '',
    amount: '',
    insertDate: '',
    leadgerJournalId: '',
    paymentMethod: ''
  };
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 10,
    filterItems: []
  };

  constructor(private modalService: NgbModal, private toaster: ToastrService, private sharedService: SharedService,
    private form: FormBuilder, private _FormService: FormService, private customerService: CustomersService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.buildForm();
    this.GetCustomersData();
    this.GetLeadgerJournalsData();
    this.GetBatchData();
  }

  buildForm() {
    this.formGroup = this.form.group({
      batchId: [null],
      nameAr: [null, [Validators.required]],
      batchType: ['Send'],
      customerId: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      insertDate: [null, [Validators.required]],
      leadgerJournalId: [null, [Validators.required]],
      paymentMethod: [null, [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  fillEditForm(item: any) {
    this.formGroup.patchValue({
      batchId: item.batchId,
      nameAr: item.batchName,
      batchType: item.batchType == 'إرسال' ? 'Send' : 'Receive',
      customerId: item.customerId,
      amount: item.amount,
      insertDate: this.datePipe.transform(item.insertDate, 'yyyy-MM-dd'),
      leadgerJournalId: item.leadgerJournalId,
      paymentMethod: item.paymentMethod,
    });
  }

  openItemModal(content: any, item: any) {
    this.formGroup.patchValue({ batchType: 'Send' });
    if (item)
      this.fillEditForm(item);
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  openDeleteItemModal(content: any, id: any) {
    this.BatchId = id;
    this.modalService.open(content, { size: 'md', centered: true, scrollable: true });
  }

  GetCustomersData() {
    this.sharedService.GetCustomersData().subscribe(data => {
      this.Customers = data;
      this.Customers = this.Customers.map(i => { return { name: i.nameAR, value: i.customerId } });
    });
  }

  GetLeadgerJournalsData() {
    this.sharedService.GetLeadgerJournalsData().subscribe(data => {
      this.leadgerJournals = data;
      this.leadgerJournalsSelector = this.leadgerJournals.map(i => { return { name: i.nameAR ?? i.nameEN, value: i.dailyNotebookId } });
    });
  }


  GetBatchData() {
    this.customerService.GetBatchData(this.FilterModel).subscribe(data => {
      this.Batches = data;
      this.TotalCount = data && data.length > 0 && data[0].totalCount ? data[0].totalCount : 0;
    });
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
  }

  AddNewDailyNotebook() {
    if (!this.validateForm())
      return;
    let formData = this.formGroup.value;
    formData.batchType = formData.batchType == 'Send' ? 'إرسال' : 'استلام';
    if (!formData?.batchId) {
      formData.batchId = 0;
      this.customerService.AddNewBatch(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.modalService.dismissAll();
          this.GetBatchData();
          this.toaster.success(data?.message);
        }
        else
          this.toaster.error(data?.message);
      });
    } else {
      this.customerService.EditBatch(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.modalService.dismissAll();
          this.GetBatchData();
          this.toaster.success(data?.message);
        }
        else
          this.toaster.error(data?.message);
      });
    }
  }

  DeleteDailyNotebook() {
    this.customerService.DeleteBatch(this.BatchId).subscribe(data => {
      if (data?.isSuccess) {
        this.toaster.success(data?.message);
        this.GetBatchData();
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
