import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralAccountSettingsService } from '../../services/general-account-settings.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

@Component({
  selector: 'app-assets-form',
  templateUrl: './assets-form.component.html',
  styleUrls: ['./assets-form.component.css']
})
export class AssetsFormComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'نماذج الأصول'];
  AssetsForms: any[] = [];
  CostTreeData: any[] = [];
  AccountTreeData: any[] = [];
  Methods = [{ name: 'خط مستقيم', value: 'خط مستقيم' }, { name: 'منخفض', value: 'منخفض' }, { name: 'الانخفاض ثم الثبات في خط مستقيم', value: 'الانخفاض ثم الثبات في خط مستقيم' }];
  Calculations = [{ name: 'بلا تناسب', value: 'بلا تناسب' }, { name: 'فترات ثابتة بناء على الأيام لكل فترة', value: 'فترات ثابتة بناء على الأيام لكل فترة' }];
  Durations = [{ name: 'شهور', value: 'شهور' }, { name: 'سنوات', value: 'سنوات' }];
  formGroup: FormGroup;
  TotalCount = 0;
  AssetsFormId: any;
  totalPages: any;
  formErrors = {
    assetsFormName: '',
    accountTreeId: '',
    costTreeId: '',
    method: '',
    durationCount: '',
    calculation: ''
  };
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterItems: []
  };

  constructor(private modalService: NgbModal, private toaster: ToastrService, private sharedService: SharedService,
    private form: FormBuilder, private _FormService: FormService, private generalAccountSettingsService: GeneralAccountSettingsService) { }

  ngOnInit(): void {
    this.buildForm();
    this.GetCostCenterTreeData();
    this.GetAccountsSelector();
    this.GetAssetsFormData();
  }

  buildForm() {
    this.formGroup = this.form.group({
      assetsFormId: [null],
      assetsFormName: [null, [Validators.required]],
      accountTreeId: [null, [Validators.required]],
      costTreeId: [null, [Validators.required]],
      method: [null, [Validators.required]],
      durationTxt: [null],
      durationCount: [null, [Validators.required]],
      calculation: [null, [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  fillEditForm(item: any) {
    this.formGroup.patchValue({
      assetsFormId: item.assetsFormId,
      assetsFormName: item.assetsFormName,
      accountTreeId: item.accountTreeId,
      costTreeId: item.costTreeId,
      method: item.method,
      durationTxt: item.durationTxt,
      durationCount: item.durationCount,
      calculation: item.calculation,
    });
  }

  openItemModal(content: any, item: any) {
    this.formGroup?.reset();
    this.formGroup.patchValue({ durationTxt: 'شهور' });
    if (item)
      this.fillEditForm(item);
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  openDeleteItemModal(content: any, id: any) {
    this.AssetsFormId = id;
    this.modalService.open(content, { size: 'md', centered: true, scrollable: true });
  }

  GetCostCenterTreeData() {
    this.sharedService.GetCostCenterTreeData(false).subscribe(data => {
      this.CostTreeData = data;
      this.CostTreeData = this.CostTreeData.map(i => { return { name: i.nameAR, value: i.costCenterId } });
    });
  }

  GetAccountsSelector() {
    this.sharedService.GetAccountsSelector().subscribe(data => {
      this.AccountTreeData = data;
    });
  }

  GetAssetsFormData() {
    this.generalAccountSettingsService.GetAssetsFormData(this.FilterModel).subscribe(data => {
      this.AssetsForms = data;
      this.TotalCount = data && data.length > 0 && data[0].totalCount ? data[0].totalCount : 0;
    });
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.GetAssetsFormData();
  }

  AddNewAssetsForm() {
    if (!this.validateForm())
      return;
    let formData = this.formGroup.value;

    if (!formData?.assetsFormId) {
      formData.assetsFormId = 0;
      this.generalAccountSettingsService.AddNewAssetsForm(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.modalService.dismissAll();
          this.GetAssetsFormData();
          this.toaster.success(data?.message);
        }
        else
          this.toaster.error(data?.message);
      });
    } else {
      this.generalAccountSettingsService.EditAssetsForm(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.modalService.dismissAll();
          this.GetAssetsFormData();
          this.toaster.success(data?.message);
        }
        else
          this.toaster.error(data?.message);
      });
    }
  }

  DeleteAssetsForm() {
    this.generalAccountSettingsService.DeleteAssetsForm(this.AssetsFormId).subscribe(data => {
      if (data?.isSuccess) {
        this.toaster.success(data?.message);
        this.GetAssetsFormData();
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
