import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { CustomersService } from '../../services/customers.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'العملاء'];
  Customers: any[] = [];
  Countries: any[] = [];
  Cities: any[] = [];
  Regions: any[] = [];
  LeadgerTypes = [];
  formGroup: FormGroup;
  TotalCount = 0;
  CustomerId: any;
  totalPages: any;
  formErrors = {
    nameAR: '',
    nameEN: '',
    phone: '',
    mobile: '',
    countryId: '',
    cityId: '',
    regionId: '',
    address: ''
  };
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterItems: []
  };

  constructor(private modalService: NgbModal,
    private toaster: ToastrService,
    private sharedService: SharedService,
    private form: FormBuilder,
    private _FormService: FormService,
    private lookupService: LookupService,
    private customerService: CustomersService) { }

  ngOnInit(): void {
    this.buildForm();
    this.GetCountriesSelector();
    this.GetCitiesSelector();
    this.GetRegionsSelector();
    this.GetCustomerData();
  }

  buildForm() {
    this.formGroup = this.form.group({
      customerId: [null],
      nameAR: [null],
      nameEN: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      mobile: [null, [Validators.required]],
      countryId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      regionId: [null, [Validators.required]],
      address: [null, [Validators.required]],
      notes: [null]
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  fillEditForm(item: any) {
    this.formGroup.patchValue({
      customerId: item.customerId,
      nameAR: item.customerNameAr,
      nameEN: item.customerNameEn,
      phone: item.phone,
      mobile: item.mobile,
      countryId: item.countryId,
      cityId: item.cityId,
      regionId: item.regionId,
      address: item.address,
      notes: item.notes,
    });
  }

  openItemModal(content: any, item: any) {
    if (item)
      this.fillEditForm(item);
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  openDeleteItemModal(content: any, id: any) {
    this.CustomerId = id;
    this.modalService.open(content, { size: 'md', centered: true, scrollable: true });
  }

  GetCountriesSelector() {
    this.lookupService.GetCountriesSelector().subscribe(data => {
      this.Countries = data;
    });
  }

  GetCitiesSelector() {
    this.lookupService.GetCitiesSelector().subscribe(data => {
      this.Cities = data;
    });
  }

  GetRegionsSelector() {
    this.sharedService.GetRegionsSelector().subscribe(data => {
      this.Regions = data;
    });
  }


  GetCustomerData() {
    this.customerService.GetCustomerData(this.FilterModel).subscribe(data => {
      this.Customers = data;
      this.TotalCount = data && data.length > 0 && data[0].totalCount ? data[0].totalCount : 0;
    });
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
  }

  AddNewDailyNotebook() {
    if (!this.validateForm())
      return;
    let formData = this.formGroup.value;

    if (!formData?.customerId) {
      formData.customerId = 0;
      this.customerService.AddNewCustomer(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.modalService.dismissAll();
          this.GetCustomerData();
          this.toaster.success(data?.message);
        }
        else
          this.toaster.error(data?.message);
      });
    } else {
      this.customerService.EditCustomer(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.modalService.dismissAll();
          this.GetCustomerData();
          this.toaster.success(data?.message);
        }
        else
          this.toaster.error(data?.message);
      });
    }
  }

  DeleteDailyNotebook() {
    this.customerService.DeleteCustomer(this.CustomerId).subscribe(data => {
      if (data?.isSuccess) {
        this.toaster.success(data?.message);
        this.GetCustomerData();
        this.modalService.dismissAll();
      }
      else
        this.toaster.error(data?.message);
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
}
