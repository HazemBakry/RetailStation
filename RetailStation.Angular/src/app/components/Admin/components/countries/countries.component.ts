import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { CountryModel } from '../../models/CountryModel';
import { AdminService } from '../../services/Admin.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  TitleList = ['التشغيل', 'الدول'];
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  countryModel: CountryModel = {} as CountryModel;
  filterList: FilterItem[] = [];

  pagedResponseModel: PagedResponseModel<CountryModel[]> = {
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
    private _FormService: FormService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.adminService.GetCountries_Data(this.pagedResponseModel).subscribe((data: any) => {
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
    countryId: '',
    nameAR: '',
    nameEN: '',
    isActive: '',

  };
  selectedCountryId: number;
  openAddModal(content: any, CountryModel: CountryModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (CountryModel)
      this.fillEditForm(CountryModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {

  }
  buildForm() {
    this.formGroup = this.form.group({
      countryId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      isActive: [true, [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.countryModel = this.formGroup.value;
    if (this.countryModel?.countryId)
      this.editNewCountry();
    else
      this.addNewCountry();
  }

  addNewCountry() {

    this.showAddLoader = true;
    this.adminService.CreateNewCountry(this.countryModel).subscribe(data => {
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

  editNewCountry() {
    this.showAddLoader = true;
    this.adminService.EditCountry(this.countryModel.countryId, this.countryModel).subscribe(data => {

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

  fillEditForm(CountryModel: CountryModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      countryId: CountryModel.countryId,
      nameAR: CountryModel.nameAR,
      nameEN: CountryModel.nameEN,
      isActive: CountryModel.isActive,
    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedCountryId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteCountry() {
    this.showAddLoader = true;
    this.adminService.DeleteCountry(this.selectedCountryId).subscribe(data => {
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
