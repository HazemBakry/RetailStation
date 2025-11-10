import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { AdminService } from '../../services/Admin.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { TopPartnerModel } from 'src/app/components/Shared/models/TopPartnerModel';
import { CustomValidators } from 'src/app/components/Shared/services/custom-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-top-partners',
  templateUrl: './top-partners.component.html',
  styleUrls: ['./top-partners.component.css']
})
export class TopPartnersComponent implements OnInit {
  TitleList = ['Top Partners'];
  defaultImage: string = `${environment.systemUrl}${environment.defaultImage}`;

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  topPartnerModel: TopPartnerModel = {} as TopPartnerModel;
  filterList: FilterItem[] = [];
  countriesSelectorData: GeneralSelectorModel[] = [];
  citiesSelectorData: GeneralSelectorModel[] = [];
  pagedResponseModel: PagedResponseModel<TopPartnerModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  imageFile: File;
  formData: FormData = new FormData();
  constructor(private adminService: AdminService,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private form: FormBuilder,
    private sharedService: SharedService,
    private _FormService: FormService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.adminService.GetTopPartners_Data(this.pagedResponseModel).subscribe((data: any) => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.loadData();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.loadData();
  }


  ////////////////////////////  Actions /////////////////////////////


  isUpdate: boolean = false;
  public formGroup: FormGroup;
  public formErrors = {
    topPartnerId: '',
    name: '',
    displayName: '',
    isActive: '',
    image: '',
    description: '',

  };
  selectedTopPartnerId: number;
  openAddModal(content: any, TopPartnerModel: TopPartnerModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (TopPartnerModel)
      this.fillEditForm(TopPartnerModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {
    this.sharedService.GetCountriesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.countriesSelectorData = data;
    });
    this.sharedService.GetCitiesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.citiesSelectorData = data;
    });
  }
  buildForm() {
    this.formGroup = this.form.group({
      topPartnerId: [null],
      name: [null, [Validators.required]],
      displayName: [null, [Validators.required]],
      isActive: [true, [Validators.required]],
      description: [null],
      image: [null, [Validators.required, CustomValidators.extensionValidator(['png', 'jpg', 'jpeg'])]],


    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
    if(this.isUpdate)
        this._FormService.updateFieldsRequiredValidation(this.formGroup, 'image', false);
  }
  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }
  saveRecord() {
    if (!this.validateForm()) return;

    this.topPartnerModel = this.formGroup.value;
    this.formData = new FormData();

    if (this.imageFile) {
      this.formData.append('image', this.imageFile);
    }

    Object.keys(this.formGroup.value).forEach(key => {
      if (key !== 'image' && this.formGroup.value[key] != undefined)
        this.formData.append(key, this.formGroup.value[key]);
    });
    this.topPartnerModel = this.formGroup.value;
    if (this.topPartnerModel?.topPartnerId)
      this.editNewTopPartner();
    else
      this.addNewTopPartner();
  }

  addNewTopPartner() {

    this.showAddLoader = true;
    this.adminService.CreateNewTopPartner(this.formData).subscribe(data => {
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

  editNewTopPartner() {
    this.showAddLoader = true;
    this.adminService.EditTopPartner(this.topPartnerModel.topPartnerId, this.formData).subscribe(data => {

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

  fillEditForm(TopPartnerModel: TopPartnerModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      topPartnerId: TopPartnerModel.topPartnerId,
      name: TopPartnerModel.name,
      displayName: TopPartnerModel.displayName,
      isActive: TopPartnerModel.isActive,
      description: TopPartnerModel.description,
    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedTopPartnerId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteTopPartner() {
    this.showAddLoader = true;
    this.adminService.DeleteTopPartner(this.selectedTopPartnerId).subscribe(data => {
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
  changeStatus(id: number) {
    this.adminService.ChangeTopPartnerActiveStatus(id).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.loadData();
      } else this.toaster.error(data.message);
    });
  }

}
