import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SalesService } from 'src/app/components/Sales/services/sales.service';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { RegionModel } from '../../models/Operation/CountryModel';
import { AdminService } from '../../services/Admin.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.css']
})
export class RegionsComponent implements OnInit {
  TitleList = ['التشغيل', 'المناطق'];
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  regionModel: RegionModel = {} as RegionModel;
  filterList: FilterItem[] = [];
  countriesSelectorData: GeneralSelectorModel[] = [];
  citiesSelectorData: GeneralSelectorModel[] = [];
  pagedResponseModel: PagedResponseModel<RegionModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }

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
    this.adminService.GetRegions_Data(this.pagedResponseModel).subscribe((data: any) => {
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
    regionId: '',
    nameAR: '',
    nameEN: '',
    isActive: '',
    code: '',
    countryId: '',
    cityId: '',

  };
  selectedRegionId: number;
  openAddModal(content: any, RegionModel: RegionModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (RegionModel)
      this.fillEditForm(RegionModel);

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
      regionId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      countryId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      isActive: [true, [Validators.required]],
      code: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.regionModel = this.formGroup.value;
    if (this.regionModel?.regionId)
      this.editNewRegion();
    else
      this.addNewRegion();
  }

  addNewRegion() {

    this.showAddLoader = true;
    this.adminService.CreateNewRegion(this.regionModel).subscribe(data => {
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

  editNewRegion() {
    this.showAddLoader = true;
    this.adminService.EditRegion(this.regionModel.regionId, this.regionModel).subscribe(data => {

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

  fillEditForm(RegionModel: RegionModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      regionId: RegionModel.regionId,
      nameAR: RegionModel.nameAR,
      nameEN: RegionModel.nameEN,
      code: RegionModel.code,
      isActive: RegionModel.isActive,
      countryId: RegionModel.countryId,
      cityId: RegionModel.cityId,
    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedRegionId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteRegion() {
    this.showAddLoader = true;
    this.adminService.DeleteRegion(this.selectedRegionId).subscribe(data => {
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
