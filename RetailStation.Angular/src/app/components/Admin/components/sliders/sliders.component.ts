import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { CustomValidators } from 'src/app/components/Shared/services/custom-validators';
import { SliderModel } from '../../models/Operation/SliderModel';
import { AdminService } from '../../services/Admin.service';

@Component({
  selector: 'app-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.css']
})
export class SlidersComponent implements OnInit {
  TitleList = ['التشغيل', 'العروض الترويجية'];
  sliderModel: SliderModel = {} as SliderModel;
  sliderResponseModel: PagedResponseModel<SliderModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };

  selectedSliderId: number;
  isUpdate: boolean = false;
  showLoader = false;
  showAddLoader = false;
  showExportLoader = false;

  formGroup: FormGroup;
  imageFile: File;
  formData: FormData = new FormData();

  formErrors = {
    sliderId: '',
    title: '',
    description: '',
    image: '',
    orderNo: '',
    isActive: ''
  };

  constructor(
    private modalService: NgbModal,
    private adminService: AdminService,
    private sharedService: SharedService,
    private form: FormBuilder,
    private _FormService: FormService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.adminService.GetSlidersData(this.sliderResponseModel).subscribe({
      next: data => {
        this.sliderResponseModel.results = data.results;
        this.sliderResponseModel.totalCount = data.totalCount;
        this.showLoader = false;
      },
      error: () => (this.showLoader = false),
      complete: () => (this.showLoader = false)
    });
  }

  openNewSliderModal(content: any, model: SliderModel = null) {
    this.isUpdate = false;
    this.buildForm();
    if (model) this.fillEditForm(model);
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  buildForm() {
    this.formGroup = this.form.group({
      sliderId: [null],
      title: [null, [Validators.required]],
      description: [null,[Validators.required]],
      image: [null,[Validators.required,CustomValidators.extensionValidator(['png','jpg','jpeg'])]],
      isActive: [true]
    });
    this.formGroup.valueChanges.subscribe(() => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }

  saveSlider() {
    if (!this.validateForm()) return;

    this.sliderModel = this.formGroup.value;
    this.formData = new FormData();

    if (this.imageFile) this.formData.append('image', this.imageFile);
    Object.keys(this.formGroup.value).forEach(key => {
      if (key !== 'image' && this.formGroup.value[key] != undefined)
        this.formData.append(key, this.formGroup.value[key]);
    });

    if (this.sliderModel.sliderId) this.editSlider();
    else this.addNewSlider();
  }

  addNewSlider() {
    this.showAddLoader = true;
    this.adminService.AddSlider(this.formData).subscribe({
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

  editSlider() {
    this.showAddLoader = true;
    this.adminService.EditSlider(this.sliderModel.sliderId, this.formData).subscribe({
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

  deleteSlider() {
    this.showAddLoader = true;
    this.adminService.DeleteSlider(this.selectedSliderId).subscribe({
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

  changeSliderStatus(sliderId: number) {
    this.adminService.ChangeSliderActiveStatus(sliderId).subscribe({
      next: data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.loadData();
        } else this.toaster.error(data.message);
      }
    });
  }

  fillEditForm(model: SliderModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      sliderId: model.sliderId,
      title: model.title,
      description: model.description,
      image: model.image,
      orderNo: model.orderNo,
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
    this.sliderResponseModel.currentPage = obj.page;
    this.loadData();
  }

  openDeleteModal(content: any, sliderId: number) {
    this.selectedSliderId = sliderId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }
}
