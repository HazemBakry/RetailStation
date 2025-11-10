
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { BranchModel } from 'src/app/components/Shared/models/BranchModel';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { MerchantManagementService } from 'src/app/components/Website/services/merchant-management.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {
  TitleList = ['التشغيل', 'الفروع '];
  defaultImage: string = `${environment.systemUrl}${environment.defaultImage}`;

  branchModel: BranchModel = {} as BranchModel;
  branchResponseModel: PagedResponseModel<BranchModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  regionsSelectorData: GeneralSelectorModel[] = [];

  selectedBranchId: number;
  isUpdate: boolean = false;
  showLoader = false;
  showAddLoader = false;
  showExportLoader = false;

  formGroup: FormGroup;
  imageFile: File;
  formData: FormData = new FormData();

  formErrors = {
    branchId: '',
    nameAR: '',
    nameEN: '',
    phone: '',
    address: '',
    regionId: '',
    openingTimeFrom: '',
    openingTimeTo: '',
    workingTimeAR: '',
    workingTimeEN: '',
    image: '',
    isActive: ''
  };

  constructor(
    private modalService: NgbModal,
    private merchantManagementService: MerchantManagementService,
    private sharedService: SharedService,
    private form: FormBuilder,
    private _FormService: FormService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.merchantManagementService.GetBranches_Data(this.branchResponseModel).subscribe({
      next: data => {
        this.branchResponseModel.results = data.results;
        this.branchResponseModel.totalCount = data.totalCount;
        this.showLoader = false;
      },
      error: () => (this.showLoader = false),
      complete: () => (this.showLoader = false)
    });
  }

  openNewBranchModal(content: any, model: BranchModel = null) {
    this.loadRegions();
    this.isUpdate = false;
    this.buildForm();
    if (model) this.fillEditForm(model);
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

    loadRegions(countryId = null, cityId: number = null) {

    this.sharedService.GetRegionIdSelector(countryId, cityId).subscribe((data: GeneralSelectorModel[]) => {
      this.regionsSelectorData = data;
    });
  }
  buildForm() {
    this.formGroup = this.form.group({
      branchId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      phone: [null, [Validators.required, CustomValidators.regexPattern(RegexType.numeric)]],
      address: [null, [Validators.required]],
      regionId: [null],
      openingTimeFrom: [null],
      openingTimeTo: [null],
      workingTimeAR: [null],
      workingTimeEN: [null, [Validators.required]],
      image: [null, [!this.isUpdate ? Validators.required : Validators.nullValidator, CustomValidators.extensionValidator(['png', 'jpg', 'jpeg'])]],
      isActive: [true]
    });
    this.formGroup.valueChanges.subscribe(() => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
    // if (this.imageFile) {
    //   this.formGroup.patchValue({ image: this.imageFile });
    //   this.formGroup.get('image')?.updateValueAndValidity();
    // }
  }

  saveBranch() {
    if (!this.validateForm()) return;

    this.branchModel = this.formGroup.value;
    this.formData = new FormData();

    if (this.imageFile) this.formData.append('image', this.imageFile);
    Object.keys(this.formGroup.value).forEach(key => {
      if (key !== 'image' && this.formGroup.value[key] != undefined)
        this.formData.append(key, this.formGroup.value[key]);
    });

    if (this.branchModel.branchId) this.editBranch();
    else this.addNewBranch();
  }

  addNewBranch() {
    this.showAddLoader = true;
    this.merchantManagementService.AddBranch(this.formData).subscribe({
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

  editBranch() {
    this.showAddLoader = true;
    this.merchantManagementService.EditBranch(this.branchModel.branchId, this.formData).subscribe({
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

  deleteBranch() {
    this.showAddLoader = true;
    this.merchantManagementService.DeleteBranch(this.selectedBranchId).subscribe({
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

  changeBranchStatus(branchId: number) {
    this.merchantManagementService.ChangeBranchActiveStatus(branchId).subscribe({
      next: data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.loadData();
        } else this.toaster.error(data.message);
      }
    });
  }

  fillEditForm(model: BranchModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      branchId: model.branchId,
      nameAR: model.nameAR,
      nameEN: model.nameEN,
      phone: model.phone,
      address: model.address,
      regionId: model.regionId,
      openingTimeFrom: model.openingTimeFrom,
      openingTimeTo: model.openingTimeTo,
      workingTimeAR: model.workingTimeAR,
      workingTimeEN: model.workingTimeEN,
      isActive: model.isActive,
      image: null
    });
    
  }

  validateForm(): boolean {
    this._FormService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) return true;
    this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, false);
    return false;
  }

  pageChanged(obj: any) {
    this.branchResponseModel.currentPage = obj.page;
    this.loadData();
  }

  openDeleteModal(content: any, branchId: number) {
    this.selectedBranchId = branchId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }
}
