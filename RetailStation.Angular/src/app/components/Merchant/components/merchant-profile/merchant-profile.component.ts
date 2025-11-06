import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MerchantService } from 'src/app/components/Website/services/merchant.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { MerchantModel } from 'src/app/components/Admin/models/MerchantModel';

@Component({
  selector: 'app-merchant-profile',
  templateUrl: './merchant-profile.component.html',
  styleUrls: ['./merchant-profile.component.css'],
})
export class MerchantProfileComponent implements OnInit {
  merchantModel: MerchantModel = {} as MerchantModel;
  showLoader: boolean = false;
  regionsSelectorData: GeneralSelectorModel[] = [];
  countriesSelectorData: GeneralSelectorModel[] = [];
  subscribersSelectorData: GeneralSelectorModel[] = [];
  paymentMethodsSelectorData: GeneralSelectorModel[] = [];
  citiesSelectorData: GeneralSelectorModel[] = [];
  public formGroup: FormGroup;
  public formErrors = {
    merchantId: '',
    nameAR: '',
    nameEN: '',
    isActive: '',
    code: '',
    description: '',
    phone: '',
    mobile: '',
    countryId: '',
    cityId: '',
    regionId: '',
    address: '',
    notes: '',
    commercialRegister: '',
    deliveryCost: '',
    rate: '',
    deliveryTime: '',
    paymentMethodId: '',
    taxNumber: '',
    bankAccountNumber: '',
    brandName: '',
    email: '',
    contactPerson: '',
    contactMobile: '',
  };

  constructor(private merchantService: MerchantService) { }

  ngOnInit(): void {

  }

  getLoggedMerchantDetails() {
    this.showLoader = true;
    this.merchantService.GetLoggedMerchantDetails().subscribe((data: any) => {
      this.merchantModel = data.results;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  fillEditForm(MerchantModel: MerchantModel) {
    this.formGroup.patchValue({
      merchantId: MerchantModel.merchantId,
      nameAR: MerchantModel.nameAR,
      nameEN: MerchantModel.nameEN,
      code: MerchantModel.code,
      isActive: MerchantModel.isActive,
      phone: MerchantModel.phone,
      mobile: MerchantModel.mobile,
      countryId: MerchantModel.countryId,
      cityId: MerchantModel.cityId,
      regionId: MerchantModel.regionId,
      address: MerchantModel.address,
      notes: MerchantModel.notes,
      commercialRegister: MerchantModel.commercialRegister,
      rate: MerchantModel.rate,
      deliveryCost: MerchantModel.deliveryCost,
      deliveryTime: MerchantModel.deliveryTime,
      paymentMethodId: MerchantModel.paymentMethodId,
      taxNumber: MerchantModel.taxNumber,
      bankAccountNumber: MerchantModel.bankAccountNumber,
      brandName: MerchantModel.brandName,
      email: MerchantModel.email,
      contactPerson: MerchantModel.contactPerson,
      contactMobile: MerchantModel.contactMobile,
    });
  }

  updateMerchantData() {

  }

}
