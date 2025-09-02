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
import { SponsorModel } from '../../models/SponsoModel';
import { HrService } from '../../services/hr.service';

@Component({
  selector: 'app-hr-sponsors',
  templateUrl: './hr-sponsors.component.html',
  styleUrls: ['./hr-sponsors.component.css']
})
export class HrSponsorsComponent implements OnInit {



  TitleList = ['الموارد البشرية', 'الكفيل'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  pagedResponse: PagedResponseDTO<SponsorModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  sponsorModel: SponsorModel = {} as SponsorModel;

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
    this._hrService.GetSponsorsData(this.pagedResponse).subscribe((data: any) => {
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
    sponsorId: '',
    code: '',
    nameAR: '',
    nameEN: '',
    isActive: '',
    notes: '',

    sponsorSSN: '',
    parentId: '',
    phone1: '',
    phone2: '',
    sponsorTypeId: '',
    address: '',
    fileName: '',
    saudi_Count: '',
    saudi_Amount: '',

  };
  sponsorTypesSelectorData: GeneralSelectorModel[] = [];
  selectedSponsorId: number;
  openAddModal(content: any, SponsorModel: SponsorModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (SponsorModel)
      this.fillEditForm(SponsorModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {
    this.lookupService.GetSponsorTypesSelector().subscribe(data => {
      this.sponsorTypesSelectorData = data;
    });

  }
  buildForm() {
    this.formGroup = this.form.group({
      sponsorId: [null],
      code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      notes: [null],
      sponsorTypeId: [null, [Validators.required]],
      isActive: [true, [Validators.required]],

      sponsorSSN: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(14)]],
      parentId: [null],
      phone1: [null, [Validators.required]],
      phone2: [null],
      address: [null, [Validators.maxLength(265)]],
      fileName: [null],
      saudi_Count: [null],
      saudi_Amount: [null],

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });

  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.sponsorModel = this.formGroup.value;
    if (this.sponsorModel?.sponsorId)
      this.editNewSponsor();
    else
      this.addNewSponsor();
  }

  addNewSponsor() {

    this.showAddLoader = true;
    this._hrService
      .CreateNewSponsor(this.sponsorModel).subscribe(data => {
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

  editNewSponsor() {


    this.showAddLoader = true;
    this._hrService
      .EditSponsor(this.sponsorModel.sponsorId, this.sponsorModel).subscribe(data => {

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

  fillEditForm(SponsorModel: SponsorModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      sponsorId: SponsorModel.sponsorId,
      code: SponsorModel.code,
      nameAR: SponsorModel.nameAR,
      nameEN: SponsorModel.nameEN,
      isActive: SponsorModel.isActive,
      notes: SponsorModel.notes,
      sponsorTypeId: SponsorModel.sponsorTypeId,
      sponsorSSN: SponsorModel.sponsorSSN,
      parentId: SponsorModel.parentId,
      phone1: SponsorModel.phone1,
      phone2: SponsorModel.phone2,
      address: SponsorModel.address,
      fileName: SponsorModel.fileName,
      saudi_Count: SponsorModel.saudi_Count,
      saudi_Amount: SponsorModel.saudi_Amount,

    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedSponsorId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteSponsor() {
    this.showAddLoader = true;
    this._hrService.DeleteSponsor(this.selectedSponsorId).subscribe(data => {

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
