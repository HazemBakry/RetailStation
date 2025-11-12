



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { environment } from 'src/environments/environment';
import { AdminService } from '../../services/Admin.service';
import { TotalValuePromotionModel } from '../../models/TotalValuePromotion';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-total-value-promotions',
  templateUrl: './admin-total-value-promotions.component.html',
  styleUrls: ['./admin-total-value-promotions.component.css']
})
export class AdminTotalValuePromotionsComponent implements OnInit {
  TitleList = ['التشغيل', 'العروض الترويجية'];
  promotionModel: TotalValuePromotionModel = {} as TotalValuePromotionModel;
  defaultImage: string = `${environment.systemUrl}${environment.defaultImage}`;

  pagedResponseModel: PagedResponseModel<TotalValuePromotionModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };

  selectedPromotionId: number;
  isUpdate: boolean = false;
  showLoader = false;
  showAddLoader = false;
  showExportLoader = false;

  formGroup: FormGroup;
  imageFile: File;
  formData: FormData = new FormData();

  formErrors = {
    totalValuePromotionId: '',
    title: '',
    description: '',
    image: '',
    discountValue: '',
    isPercentage: '',
    valueType: '',
    minValue: '',
    startDate: '',
    endDate: '',
    isActive: ''
  };

  constructor(
    private modalService: NgbModal,
    private adminService: AdminService,
    private sharedService: SharedService,
    private form: FormBuilder,
    private _FormService: FormService,
    private toaster: ToastrService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.adminService.GetTotalValuePromotions_Data(this.pagedResponseModel).subscribe({
      next: data => {
        this.pagedResponseModel.results = data.results;
        this.pagedResponseModel.totalCount = data.totalCount;
        this.showLoader = false;
      },
      error: () => (this.showLoader = false),
      complete: () => (this.showLoader = false)
    });
  }

  openNewPromotionModal(content: any, model: TotalValuePromotionModel = null) {
    this.isUpdate = false;
    this.buildForm();
    if (model) this.fillEditForm(model);
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  buildForm() {
    this.formGroup = this.form.group({
      totalValuePromotionId: [null],
      code: [null],
      title: [null, [Validators.required]],
      description: [null],
      image: [null, [this.isUpdate ? Validators.nullValidator : Validators.required, CustomValidators.extensionValidator(['png', 'jpg', 'jpeg'])], [CustomValidators.imageDimensionValidator(1920, 1080)]],
      discountValue: [null, [Validators.required, Validators.min(0), CustomValidators.regexPattern(RegexType.numeric)]],
      isPercentage: [false],
      valueType: ['FIXED_AMOUNT', [Validators.required]],
      maxUsesGlobal: [null],
      maxUsesPerCustomer: [null],
      minValue: [null, [Validators.min(0), CustomValidators.regexPattern(RegexType.numeric)]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      isActive: [true]
    });
    this.formGroup.valueChanges.subscribe(() => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }

  savePromotion() {
    if (!this.validateForm()) return;

    this.promotionModel = this.formGroup.value;
    this.formData = new FormData();

    if (this.imageFile) this.formData.append('image', this.imageFile);
    Object.keys(this.formGroup.value).forEach(key => {
      if (key !== 'image' && this.formGroup.value[key] != undefined)
        this.formData.append(key, this.formGroup.value[key]);
    });

    if (this.promotionModel.totalValuePromotionId) this.editPromotion();
    else this.addNewPromotion();
  }

  addNewPromotion() {
    this.showAddLoader = true;
    this.adminService.AddTotalValuePromotion(this.formData).subscribe({
      next: (data: ActionsResponseModel) => {
        if (data?.isSuccess) {
          this.toaster.success(data.message);
          this.modalService.dismissAll();
          this.loadData();
        } else this.toaster.error(data.message);
      },
      error: () => (this.showAddLoader = false),
      complete: () => (this.showAddLoader = false)
    });
  }

  editPromotion() {
    this.showAddLoader = true;
    this.adminService.EditTotalValuePromotion(this.promotionModel.totalValuePromotionId, this.formData).subscribe({
      next: (data: ActionsResponseModel) => {
        if (data?.isSuccess) {
          this.toaster.success(data.message);
          this.modalService.dismissAll();
          this.loadData();
        } else this.toaster.error(data.message);
      },
      error: () => (this.showAddLoader = false),
      complete: () => (this.showAddLoader = false)
    });
  }

  deletePromotion() {
    this.showAddLoader = true;
    this.adminService.DeleteTotalValuePromotion(this.selectedPromotionId).subscribe({
      next: data => {
        if (data?.isSuccess) {
          this.toaster.success(data.message);
          this.modalService.dismissAll();
          this.loadData();
        } else this.toaster.error(data.message);
      },
      error: () => (this.showAddLoader = false),
      complete: () => (this.showAddLoader = false)
    });
  }

  changePromotionStatus(promotionId: number) {
    this.adminService.ChangeTotalValuePromotionActiveStatus(promotionId).subscribe({
      next: data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.loadData();
        } else this.toaster.error(data.message);
      }
    });
  }

  fillEditForm(model: TotalValuePromotionModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      totalValuePromotionId: model.totalValuePromotionId,
      code: model.code,
      title: model.title,
      description: model.description,
      discountValue: model.discountValue,
      isPercentage: model.isPercentage,
      valueType: model.valueType,
      maxUsesGlobal: model.maxUsesGlobal,
      maxUsesPerCustomer: model.maxUsesPerCustomer,
      minValue: model.minValue,
      startDate: this.datePipe.transform(model.startDate, 'yyyy-MM-ddTHH:mm'),
      endDate: this.datePipe.transform(model.endDate, 'yyyy-MM-ddTHH:mm'),
      isActive: model.isActive
    });
  }

  validateForm(): boolean {
    this._FormService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) return true;
    this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, false);
    return false;
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.loadData();
  }

  openDeleteModal(content: any, promotionId: number) {
    this.selectedPromotionId = promotionId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }
}