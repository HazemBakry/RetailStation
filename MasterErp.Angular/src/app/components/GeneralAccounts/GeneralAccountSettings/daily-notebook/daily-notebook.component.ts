import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralAccountSettingsService } from '../../services/general-account-settings.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { DatePipe } from '@angular/common';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { GeneralAccountService } from '../../services/general-account.service';
import { PaymentService } from '../../services/payment.service';
import { DailyNotebookModel } from '../../models/GeneralAccounts/DailyNotebookModel';

@Component({
  selector: 'app-daily-notebook',
  templateUrl: './daily-notebook.component.html',
  styleUrls: ['./daily-notebook.component.css']
})
export class DailyNotebookComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'الدفاتر اليومية'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  pagedResponse: PagedResponseDTO<DailyNotebookModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  dailyNotebookModel: DailyNotebookModel =
    {} as DailyNotebookModel;

  constructor(private GeneralAccountsService: GeneralAccountService,
    private generalAccountSettingsService: GeneralAccountSettingsService,
    private toaster: ToastrService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private paymentService: PaymentService,
    private lookupService: LookupService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.generalAccountSettingsService.GetDailyNotebooksData(this.pagedResponse).subscribe((data: any) => {
      this.pagedResponse.results = data.results;
      this.pagedResponse.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }



  pageChanged(obj: any) {
    this.pagedResponse.currentPage = obj.page;
    this.loadData();
  }



  ////////////////////////////  Actions /////////////////////////////


  isUpdate: boolean = false;
  public formGroup: FormGroup;
  public formErrors = {
    dailyNotebookId: '',
    code: '',
    nameAR: '',
    nameEN: '',
    ledgerTypeId: '',
    virtualAccount: ''
  };

  receiptLedgerTypesSelectorData: GeneralSelectorModel[] = [];
  selectedDailyNotebookId: number;
  openAddModal(content: any, dailyNotebookModel: DailyNotebookModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (dailyNotebookModel)
      this.fillEditForm(dailyNotebookModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {
    this.lookupService.GetLedgerTypes().subscribe(data => {
      this.receiptLedgerTypesSelectorData = data;
    });
  }
  buildForm() {
    this.formGroup = this.form.group({
      dailyNotebookId: [null],
      code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      ledgerTypeId: [null, [Validators.required]],
      virtualAccount: [null, [Validators.required]],

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });

  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.dailyNotebookModel = this.formGroup.value;
    if (this.dailyNotebookModel?.dailyNotebookId)
      this.editNewDailyNotebook();
    else
      this.addNewDailyNotebook();
  }

  addNewDailyNotebook() {

    this.showAddLoader = true;
    this.generalAccountSettingsService
      .CreateNewDailyNotebook(this.dailyNotebookModel).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.modalService?.dismissAll();
          this.loadData();
          this.toaster.success(data?.message);
        }
        else {
          this.toaster.error(data?.message);
        }
        this.showAddLoader = false;
      }, err => {
        this.showAddLoader = false;
      }, () => {
        this.showAddLoader = false;
      });



  }

  editNewDailyNotebook() {
    this.showAddLoader = true;
    this.generalAccountSettingsService
      .EditDailyNotebook(this.dailyNotebookModel.dailyNotebookId, this.dailyNotebookModel).subscribe(data => {

        if (data?.isSuccess) {
          // this.formGroup?.reset();
          this.isUpdate = false;
          this.modalService?.dismissAll();
          this.formGroup?.reset();
          this.toaster.success(data?.message);

          this.loadData();
        }
        else {
          this.toaster.error(data?.message);
        }
        this.showAddLoader = false;
      }, err => {
        this.showAddLoader = false;
      }, () => {
        this.showAddLoader = false;
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

  fillEditForm(dailyNotebookModel: DailyNotebookModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      dailyNotebookId: dailyNotebookModel.dailyNotebookId,
      code: dailyNotebookModel.code,
      nameAR: dailyNotebookModel.nameAR,
      nameEN: dailyNotebookModel.nameEN,
      virtualAccount: dailyNotebookModel.virtualAccount,
      ledgerTypeId: dailyNotebookModel.ledgerTypeId,
      // startDate: this.datePipe.transform(dailyNotebookModel.startDate, 'yyyy-MM-dd'),
      // endDate: this.datePipe.transform(dailyNotebookModel.endDate, 'yyyy-MM-dd'),

    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedDailyNotebookId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteDailyNotebook() {
    this.showAddLoader = true;
    this.generalAccountSettingsService.DeleteDailyNotebook(this.selectedDailyNotebookId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.loadData();
        this.toaster.success(data?.message);
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showAddLoader = false;
    }, err => {
      this.showAddLoader = false;
    }, () => {
      this.showAddLoader = false;
    });
  }

}
