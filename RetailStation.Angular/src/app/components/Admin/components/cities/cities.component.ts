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
import { CityModel } from '../../models/Operation/CountryModel';
import { AdminService } from '../../services/Admin.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  TitleList = ['التشغيل', 'المدن'];
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  cityModel: CityModel = {} as CityModel;
  filterList: FilterItem[] = [];
  countriesSelectorData: GeneralSelectorModel[] = [];
  citiesSelectorData: GeneralSelectorModel[] = [];
  pagedResponseModel: PagedResponseModel<CityModel[]> = {
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
    this.adminService.GetCities_Data(this.pagedResponseModel).subscribe((data: any) => {
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
    cityId: '',
    nameAR: '',
    nameEN: '',
    isActive: '',
    postalCode: '',
    countryId: ''

  };
  selectedCityId: number;
  openAddModal(content: any, CityModel: CityModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (CityModel)
      this.fillEditForm(CityModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {
    this.sharedService.GetCountriesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.countriesSelectorData = data;
    });
  }
  buildForm() {
    this.formGroup = this.form.group({
      cityId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      countryId:  [null, [Validators.required]],
      isActive: [true, [Validators.required]],
      postalCode: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.cityModel = this.formGroup.value;
    if (this.cityModel?.cityId)
      this.editNewCity();
    else
      this.addNewCity();
  }

  addNewCity() {

    this.showAddLoader = true;
    this.adminService.CreateNewCity(this.cityModel).subscribe(data => {
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

  editNewCity() {
    this.showAddLoader = true;
    this.adminService.EditCity(this.cityModel.cityId, this.cityModel).subscribe(data => {

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

  fillEditForm(CityModel: CityModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      cityId: CityModel.cityId,
      nameAR: CityModel.nameAR,
      nameEN: CityModel.nameEN,
      postalCode: CityModel.postalCode,
      isActive: CityModel.isActive,
      countryId: CityModel.countryId,
    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedCityId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteCity() {
    this.showAddLoader = true;
    this.adminService.DeleteCity(this.selectedCityId).subscribe(data => {
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
