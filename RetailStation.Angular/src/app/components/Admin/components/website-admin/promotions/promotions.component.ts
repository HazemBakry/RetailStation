import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { PromotionModel } from '../../../models/Operation/PromotionModel';
import { AdminService } from '../../../services/Admin.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {
  TitleList = ['التشغيل', 'العروض الترويجية'];
  promotionModel: PromotionModel = {} as PromotionModel;

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
    itemId: '',
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
    private adminService: AdminService,
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
    this.adminService.GetPromotionsData(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, () => this.showLoader = false);
  }

  buildForm() {
    this.formGroup = this.fb.group({
      promotionId: [null],
      title: [null, [Validators.required]],
      itemId: [null, [Validators.required]],
      description: [null],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      offerPrice: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      minQty: [null, [CustomValidators.regexPattern(RegexType.number)]],
      maxQty: [null, [CustomValidators.regexPattern(RegexType.number)]],
      image: [null, [Validators.required, CustomValidators.extensionValidator(['png', 'jpg', 'jpeg'])]],
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

    this.sharedService.GetItemsSelector().subscribe((data: GeneralSelectorModel[]) => {
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
    this.adminService.AddNewPromotion(this.formData).subscribe((data: ActionsResponseModel) => {
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
    this.adminService.EditPromotion(this.promotionModel.promotionId, this.formData).subscribe((data: ActionsResponseModel) => {
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
    this.adminService.ChangePromotionActiveStatus(id).subscribe(data => {
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
    this.adminService.DeletePromotion(this.selectedPromotionId).subscribe(data => {
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
      itemId: model.itemId,
      description: model.description,
      startDate: this.datePipe.transform(model.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(model.endDate, 'yyyy-MM-dd'),
      offerPrice: model.offerPrice,
      minQTY: model.minQty,
      maxQty: model.maxQty,
      isActive: model.isActive
    });
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.loadData();
  }
}
