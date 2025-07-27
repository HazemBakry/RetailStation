import { Component, OnInit } from '@angular/core';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { PurchaseInvoiceTypeModel } from '../../models/PurchaseInvoiceTypeModel';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-purchase-invoice-types',
  templateUrl: './purchase-invoice-types.component.html',
  styleUrls: ['./purchase-invoice-types.component.css']
})
export class PurchaseInvoiceTypesComponent implements OnInit {



  TitleList = ['الموارد البشرية', 'الكفيل'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  pagedResponse: PagedResponseDTO<PurchaseInvoiceTypeModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  purchaseInvoiceTypeModel: PurchaseInvoiceTypeModel = {} as PurchaseInvoiceTypeModel;

  constructor(private purchaseService: PurchaseService, private toaster: ToastrService,
    private sharedService: SharedService,
    private modalService: NgbModal,
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
    this.purchaseService.GetPurchaseInvoiceTypesData(this.pagedResponse).subscribe((data: any) => {
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
    purchaseInvoiceTypeId: '',
    nameAR: '',
    nameEN: '',
    isActive: '',
    isBindToGeneralAccounting: '',
    notes: '',
    accountDebitId: '',
    accountCreditId: ''

  };
  accountsSelectorData: GeneralSelectorModel[] = [];
  selectedPurchaseInvoiceTypeId: number;
  openAddModal(content: any, PurchaseInvoiceTypeModel: PurchaseInvoiceTypeModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (PurchaseInvoiceTypeModel)
      this.fillEditForm(PurchaseInvoiceTypeModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {
    this.sharedService.GetAccountsSelector(false).subscribe(data => {
      this.accountsSelectorData = data;
    });

  }
  buildForm() {
    this.formGroup = this.form.group({
      purchaseInvoiceTypeId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      notes: [null],
      accountCreditId: [null, [Validators.required]],
      accountDebitId: [null, [Validators.required]],
      isActive: [true, [Validators.required]],
      isBindToGeneralAccounting: [false, [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
    // this.formGroup.get('isBindToGeneralAccounting').valueChanges.subscribe((value) => {
    //   if (value) {
    //     this._FormService.updateFieldsRequiredValidation(this.formGroup, 'accountCreditId', true);
    //     this._FormService.updateFieldsRequiredValidation(this.formGroup, 'accountDebitId', true);
    //   }
    //   else {
    //     this._FormService.updateFieldsRequiredValidation(this.formGroup, 'accountCreditId', false);
    //     this._FormService.updateFieldsRequiredValidation(this.formGroup, 'accountDebitId', false);
    //   }
    // });
  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.purchaseInvoiceTypeModel = this.formGroup.value;
    if (this.purchaseInvoiceTypeModel?.purchaseInvoiceTypeId)
      this.editNewPurchaseInvoiceType();
    else
      this.addNewPurchaseInvoiceType();
  }

  addNewPurchaseInvoiceType() {

    this.showAddLoader = true;
    this.purchaseService
      .CreateNewPurchaseInvoiceType(this.purchaseInvoiceTypeModel).subscribe(data => {
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

  editNewPurchaseInvoiceType() {


    this.showAddLoader = true;
    this.purchaseService
      .EditPurchaseInvoiceType(this.purchaseInvoiceTypeModel.purchaseInvoiceTypeId, this.purchaseInvoiceTypeModel).subscribe(data => {

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

  fillEditForm(PurchaseInvoiceTypeModel: PurchaseInvoiceTypeModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      purchaseInvoiceTypeId: PurchaseInvoiceTypeModel.purchaseInvoiceTypeId,
      nameAR: PurchaseInvoiceTypeModel.nameAR,
      nameEN: PurchaseInvoiceTypeModel.nameEN,
      isBindToGeneralAccounting: PurchaseInvoiceTypeModel.isBindToGeneralAccounting,
      isActive: PurchaseInvoiceTypeModel.isActive,
      notes: PurchaseInvoiceTypeModel.notes,
      accountCreditId: PurchaseInvoiceTypeModel.accountCreditId,
      accountDebitId: PurchaseInvoiceTypeModel.accountDebitId,
    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedPurchaseInvoiceTypeId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deletePurchaseInvoiceType() {
    this.showAddLoader = true;
    this.purchaseService.DeletePurchaseInvoiceType(this.selectedPurchaseInvoiceTypeId).subscribe(data => {

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
