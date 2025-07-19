import { Component, OnInit } from '@angular/core';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { HrService } from '../../services/hr.service';

@Component({
  selector: 'app-hr-regions',
  templateUrl: './hr-regions.component.html',
  styleUrls: ['./hr-regions.component.css']
})
export class HrRegionsComponent implements OnInit {



  TitleList = ['الموارد البشرية', 'بيانات المناطق'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  pagedResponse: PagedResponseDTO<any[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  regionModel: any = {} as any;

  constructor(private _hrService: HrService, private toaster: ToastrService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private lookupService: LookupService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this._hrService.GetRegionsData(this.pagedResponse).subscribe((data: any) => {
      this.pagedResponse.results = data.results;
      this.pagedResponse.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  pageChanged(obj: any) {
    this.pagedResponse.currentPage = obj.page;
    this.loadData();
  }

  ////////////////////////////  Actions /////////////////////////////


  isUpdate: boolean = false;
  public formGroup: FormGroup;
  public formErrors = {
    regionId: '',
    nameAR: '',
    nameEN: '',
    isActive: ''
  };

  //sponsorTypesSelectorData: GeneralSelectorModel[] = [];
  selectedRegionId: number;

  openAddModal(content: any, RegionModel: any = null) {
    //this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (RegionModel)
      this.fillEditForm(RegionModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }

  // loadSelectors() {
  //   this.lookupService.GetSponsorTypesSelector().subscribe(data => {
  //     this.sponsorTypesSelectorData = data;
  //   });
  // }

  buildForm() {
    this.formGroup = this.form.group({
      regionId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      isActive: [true]
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
    this._hrService
      .CreateNewRegion(this.regionModel).subscribe(data => {
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
    this._hrService.EditRegion(this.regionModel.regionId, this.regionModel).subscribe(data => {
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

  fillEditForm(RegionModel: any) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      regionId: RegionModel.regionId,
      nameAR: RegionModel.nameAR,
      nameEN: RegionModel.nameEN,
      isActive: RegionModel.isActive,
    });
  }

  openDeleteModal(content: any, id: number) {
    this.selectedRegionId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteRegion() {
    this.showAddLoader = true;
    this._hrService.DeleteRegion(this.selectedRegionId).subscribe(data => {
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
