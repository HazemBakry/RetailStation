import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { MerchantManagementService } from 'src/app/components/Website/services/merchant-management.service';
import { MerchantDeliveryRegionModel } from '../../models/MerchantDeliveryRegionModel';

@Component({
  selector: 'app-merchant-delivery-regions',
  templateUrl: './merchant-delivery-regions.component.html',
  styleUrls: ['./merchant-delivery-regions.component.css']
})
export class MerchantDeliveryRegionsComponent implements OnInit {

  TitleList = ['الإعدادات', 'مناطق التوصيل'];

  regionModel: MerchantDeliveryRegionModel = {} as MerchantDeliveryRegionModel;

  pagedResponseModel: PagedResponseModel<MerchantDeliveryRegionModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };

  countries: GeneralSelectorModel[] = [];
  cities: GeneralSelectorModel[] = [];
  regions: GeneralSelectorModel[] = [];

  showLoader = false;
  showAddLoader = false;
  isUpdate = false;

  public formGroup: FormGroup;
  public formErrors = {
    merchantDeliveryRegionId: '',
    merchantId: '',
    countryId: '',
    cityId: '',
    regionId: '',
    cost: '',
    deliveryTime: '',
    deliveryTimeUnit: '',
    isActive: ''
  };

  selectedRegionId: number;

  constructor(
    private modalService: NgbModal,
    private merchantManagementService: MerchantManagementService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private _formService: FormService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadSelectors();
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.merchantManagementService.GetMerchantDeliveryRegions(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, () => this.showAddLoader = false, () => this.showAddLoader = false);
  }


  loadSelectors() {
    this.sharedService.GetCountriesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.countries = data;
    });
  }
  loadCitiesByCountryId(countryId: number) {
    this.sharedService.GetCitiesSelector(countryId).subscribe((data: GeneralSelectorModel[]) => {
      this.cities = data;
    });
  }

  loadRegions(countryId = null, cityId: number = null) {

    this.sharedService.GetRegionIdSelector(countryId, cityId).subscribe((data: GeneralSelectorModel[]) => {
      this.regions = data;
    });
  }
  buildForm() {
    this.formGroup = this.fb.group({
      merchantDeliveryRegionId: [null],
      merchantId: [null],
      countryId: [null, Validators.required],
      cityId: [null],
      regionId: [null],
      cost: [null, [Validators.required]],
      deliveryTime: [null, [Validators.required]],
      deliveryTimeUnit: [null, Validators.required],
      isActive: [true]
    });

    this.formGroup.valueChanges.subscribe(() =>
      this.formErrors = this._formService.validateForm(this.formGroup, this.formErrors, true)
    );
    this.formGroup.get('countryId').valueChanges.subscribe(countryId => {
      this.cities = [];
      this.regions = [];
      this.formGroup.patchValue({ cityId: null, regionId: null });
      if (countryId) {
        this.loadCitiesByCountryId(countryId);
        this.loadRegions(countryId);
      }
    });
  }

  openNewRegionPanel(content: any, region: MerchantDeliveryRegionModel = null) {
    this.buildForm();
    this.isUpdate = false;

    if (region) {
      this.isUpdate = true;
      this.fillEditForm(region);
    }

    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  saveRegion() {
    if (!this.validateForm()) return;

    this.regionModel = this.formGroup.value;

    if (this.regionModel.merchantDeliveryRegionId)
      this.editRegion();
    else
      this.addRegion();
  }

  addRegion() {
    this.showAddLoader = true;
    this.merchantManagementService.AddMerchantDeliveryRegion(this.regionModel)
      .subscribe((data: ActionsResponseModel) => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.modalService.dismissAll();
          this.loadData();
        } else this.toaster.error(data.message);
        this.showAddLoader = false;
      }, () => this.showAddLoader = false, () => this.showAddLoader = false);
  }

  editRegion() {
    this.showAddLoader = true;
    this.merchantManagementService.EditMerchantDeliveryRegion(
      this.regionModel.merchantDeliveryRegionId, this.regionModel
    ).subscribe((data: ActionsResponseModel) => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.modalService.dismissAll();
        this.loadData();
      } else this.toaster.error(data.message);
      this.showAddLoader = false;
    }, () => this.showAddLoader = false, () => this.showAddLoader = false);
  }

  changeStatus(id: number) {
    this.merchantManagementService.ChangeMerchantDeliveryRegionActiveStatus(id).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.loadData();
      } else this.toaster.error(data.message);
    });
  }

  openDeleteModal(content: any, id: number) {
    this.selectedRegionId = id;
    this.modalService.open(content, { centered: true });
  }

  deleteRegion() {
    this.showAddLoader = true;
    this.merchantManagementService.DeleteMerchantDeliveryRegion(this.selectedRegionId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.modalService.dismissAll();
        this.loadData();
      } else this.toaster.error(data.message);
      this.showAddLoader = false;
    }, () => this.showAddLoader = false, () => this.showAddLoader = false);
  }

  validateForm() {
    this._formService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) return true;
    this.formErrors = this._formService.validateForm(this.formGroup, this.formErrors, false);
    return false;
  }

  fillEditForm(m: MerchantDeliveryRegionModel) {
    this.formGroup.patchValue({
      merchantDeliveryRegionId: m.merchantDeliveryRegionId,
      merchantId: m.merchantId,
      countryId: m.countryId,
      cityId: m.cityId,
      regionId: m.regionId,
      cost: m.cost,
      deliveryTime: m.deliveryTime,
      deliveryTimeUnit: m.deliveryTimeUnit,
      isActive: m.isActive
    });
  }

  pageChanged(e: any) {
    this.pagedResponseModel.currentPage = e.page;
    this.loadData();
  }
}
