import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { DatePipe } from '@angular/common';
import { PromotionModel } from 'src/app/components/Shared/models/PromotionModel';
import { AdminService } from 'src/app/components/Admin/services/Admin.service';
import { MerchantManagementService } from 'src/app/components/Website/services/merchant-management.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-merchant-promotions',
  templateUrl: './merchant-promotions.component.html',
  styleUrls: ['./merchant-promotions.component.css']
})
export class MerchantPromotionsComponent implements OnInit {
  TitleList = ['التشغيل', 'العروض الترويجية'];
  promotionModel: PromotionModel = {} as PromotionModel;
  defaultImage: string = `${environment.systemUrl}${environment.defaultImage}`;

  pagedResponseModel: PagedResponseModel<PromotionModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  itemsSelectorData: GeneralSelectorModel[] = [];

  showLoader = false;
  showAddLoader = false;
  showExportLoader = false;
  isUpdate = false;

  public formGroup: FormGroup;
  public formErrors = {
    promotionId: '',
    merchantItemId: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    offerPrice: '',
    minQty: '',
    maxQty: '',
    image: '',
    isActive: ''
  };

  imageFile: File;
  formData: FormData = new FormData();
  selectedPromotionId: number;

  constructor(
    private modalService: NgbModal,
    private merchantManagementService: MerchantManagementService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private _formService: FormService,
    private toaster: ToastrService,
    private datePipe: DatePipe,
    private offcanvasService: NgbOffcanvas
  ) { }

  ngOnInit(): void {
    this.loadSelectors();
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.merchantManagementService.GetPromotionsData(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, () => this.showLoader = false);
  }

  buildForm() {
    this.formGroup = this.fb.group({
      promotionId: [null],
      title: [null, [Validators.required]],
      merchantItemId: [null, [Validators.required]],
      description: [null],
      startDate: [null],
      endDate: [null],
      offerPrice: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      minQty: [null, [CustomValidators.regexPattern(RegexType.number)]],
      maxQty: [null, [CustomValidators.regexPattern(RegexType.number)]],
      image: [null, [this.isUpdate ? Validators.nullValidator : Validators.required, CustomValidators.extensionValidator(['png', 'jpg', 'jpeg'])]],
      isActive: [true]
    });

    this.formGroup.valueChanges.subscribe(() => {
      this.formErrors = this._formService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  openNewPromotionPanel(content: any, promo: PromotionModel = null) {
    this.buildForm();
    this.isUpdate = false;

    if (promo) {
      this.isUpdate = true;
      this.fillEditForm(promo);
    }

    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }
  loadSelectors() {

    this.sharedService.GetCurrentMerchantItemsSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.itemsSelectorData = data;
    });
  }
  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }

  savePromotion() {
    if (!this.validateForm()) return;

    this.promotionModel = this.formGroup.value;
    this.formData = new FormData();

    if (this.imageFile) {
      this.formData.append('image', this.imageFile);
    }

    Object.keys(this.formGroup.value).forEach(key => {
      if (key !== 'image' && this.formGroup.value[key] != undefined)
        this.formData.append(key, this.formGroup.value[key]);
    });

    if (this.promotionModel.promotionId)
      this.editPromotion();
    else
      this.addNewPromotion();
  }

  addNewPromotion() {
    this.showAddLoader = true;
    this.merchantManagementService.AddNewPromotion(this.formData).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup.reset();
        this.toaster.success(data.message);
        this.modalService.dismissAll();
        this.loadData();
      } else this.toaster.error(data.message);
      this.showAddLoader = false;
    });
  }

  editPromotion() {
    this.showAddLoader = true;
    this.merchantManagementService.EditPromotion(this.promotionModel.promotionId, this.formData).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup.reset();
        this.toaster.success(data.message);
        this.modalService.dismissAll();
        this.loadData();
      } else this.toaster.error(data.message);
      this.showAddLoader = false;
    });
  }

  changeStatus(id: number) {
    this.merchantManagementService.ChangePromotionActiveStatus(id).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.loadData();
      } else this.toaster.error(data.message);
    });
  }

  openDeleteModal(content: any, id: number) {
    this.selectedPromotionId = id;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  deletePromotion() {
    this.showAddLoader = true;
    this.merchantManagementService.DeletePromotion(this.selectedPromotionId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.modalService.dismissAll();
        this.loadData();
      } else this.toaster.error(data.message);
      this.showAddLoader = false;
    });
  }

  validateForm(): boolean {
    this._formService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) return true;
    this.formErrors = this._formService.validateForm(this.formGroup, this.formErrors, false);
    return false;
  }

  fillEditForm(model: PromotionModel) {
    this.formGroup.patchValue({
      promotionId: model.promotionId,
      title: model.title,
      merchantItemId: model.merchantItemId,
      description: model.description,
      startDate: this.datePipe.transform(model.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(model.endDate, 'yyyy-MM-dd'),
      offerPrice: model.offerPrice,
      minQty: model.minQty,
      maxQty: model.maxQty,
      isActive: model.isActive
    });
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.loadData();
  }
}
