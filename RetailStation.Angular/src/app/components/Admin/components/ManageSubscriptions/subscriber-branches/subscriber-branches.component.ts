import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { BranchModel } from 'src/app/components/Shared/models/BranchModel';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { RoleModel } from 'src/app/components/Shared/models/RoleModel';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { environment } from 'src/environments/environment';
import { SubscriptionsService } from '../../../services/subscriptions.service';

@Component({
  selector: 'app-subscriber-branches',
  templateUrl: './subscriber-branches.component.html',
  styleUrls: ['./subscriber-branches.component.css']
})
export class SubscriberBranchesComponent implements OnInit {
  @Input() subscriberId: string;

  usersData: BranchModel[] = [];
  URLs: any[] = [];
  ImagesName: any[] = [];

  systemUrl: string = environment.systemUrl
  filterList: FilterModel[] = [];
  lang: string = 'en';

  defaultImage = `${this.systemUrl}assets/images/av-8.png`;
  searchText = '';
  // form: FormGroup;
  branchModel: BranchModel = {} as BranchModel;
  BranchId: any;
  totalCount: any;
  totalPages: any;
  pageSize: any = 8;
  currentPage: any = 1;
  StartIndex = 0;
  manageRoles = false;
  BranchValidate = false;
  selectedBranch: any;
  rolesList: RoleModel[] = [];

  pagedResponse: PagedResponseModel<BranchModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''

  }
  selectedBranchId: number;
  citiesSelectorData: FormDropdownModel[] = [
    {
      name: 'city 1',
      value: 1
    }
  ];
  public formGroup: FormGroup;
  formData: FormData = new FormData();
  selectedFile: File;
  public formErrors = {
    branchId: '',
    subscriberId: '',
    code: '',
    displayOrder: '',
    nameAR: '',
    nameEN: '',
    isActive: '',
    isAdminBranch: '',
    cityId: '',
    drawingsCostCenterId: '',
    expensesCostCenterId: '',
    phone: '',
    email: '',
    openingTimeFrom:'',
    openingTimeTo:'',
    fax: '',
    address: '',
    notes: '',
  }
  showLoader: boolean = false;
  showAddLoader: boolean = false;




  constructor(private acRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private subscriptionsService: SubscriptionsService,
    private sharedService: SharedService,
    private form: FormBuilder,
    private _FormService: FormService,
    private toaster: ToastrService,
    private offcanvasService: NgbOffcanvas,
    private datePipe: DatePipe) { }

  ngOnInit(): void {

    this.acRoute.parent.params.subscribe((params: any) => {
      if (params.SubscriberId) {
        this.subscriberId = params.SubscriberId;
        this.getBranchesData();
        this.loadSelectors();
      }
    });


  }
  openBranchPopup(content: any, user: BranchModel = null) {

    this.buildForm();
    this.URLs = [];
    if (user != null)
      this.fillEditForm(user)
    this.modalService.open(content, { size: 'lg', centered: true });
  }
  loadSelectors() {
    // this.hrService.GetActiveEmployeesSelector().subscribe((data :FormDropdownModel[])=> {
    //   this.employeesSelectorData = data;
    // });
  }
  buildForm() {
    this.formGroup = this.form.group({
      branchId: [null],
      subscriberId: [null],
      code: [null,[Validators.required]],
      displayOrder: [1, [Validators.required]],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      isActive: [true],
      isAdminBranch: [false],
      cityId: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.email]],
      fax: [null],
      openingTimeFrom:[null],
      openingTimeTo:[null],
      address: [null, [Validators.required]],
      notes: [null],
      image: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });

  }

  fillEditForm(branch: BranchModel) {
    this.formGroup.patchValue({
      branchId: branch.branchId,
      subscriberId: branch.subscriberId,
      code: branch.code,
      displayOrder: branch.displayOrder,
      nameAR: branch.nameAR,
      nameEN: branch.nameEN,
      isActive: branch.isActive,
      isAdminBranch: branch.isAdminBranch,
      cityId: branch.cityId,
      phone: branch.phone,
      email: branch.email,
      fax: branch.fax,
      openingTimeFrom:this.datePipe.transform(branch.openingTimeFrom, 'yyyy-MM-dd'),
      openingTimeTo:this.datePipe.transform(branch.openingTimeTo, 'yyyy-MM-dd'),
      address: branch.address,
      notes: branch.notes,
    });

  }

  saveBranch() {
    if (!this.validateForm()) {
      return;
    }
    this.branchModel = this.formGroup.value;
    this.formData = new FormData();
    if (this.selectedFile)
      this.formData.append('image', this.selectedFile);
    for (const key in this.formGroup.value) {
      if (this.formGroup.value[key] && key != 'image') {
        this.formData.append(key, this.formGroup.value[key]);
      }
    }

    if (this.branchModel?.branchId)
      this.editBranch();
    else
      this.addNewBranch();
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

  addNewBranch() {
    this.showAddLoader = true;
    this.subscriptionsService.addNewBranch(this.subscriberId, this.formData).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.getBranchesData();
        this.formGroup?.reset();
        this.modalService.dismissAll();
        this.selectedFile = null;
      } else {
        this.toaster.error(data.message);
      }
      this.showAddLoader = false;
    });
  }
  editBranch() {
    this.showAddLoader = true;
    this.subscriptionsService.editBranch(this.subscriberId, this.branchModel.branchId, this.formData).subscribe((data: ActionsResponseModel) => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.getBranchesData();
        this.formGroup?.reset();
        this.modalService.dismissAll();
        this.selectedFile = null;
      } else {
        this.toaster.error(data.message);
      }
      this.showAddLoader = false;
    });
  }



  openDeleteBranchModal(content: any, branchModel: BranchModel) {
    this.branchModel = branchModel;
    this.modalService.open(content, { size: 'md', centered: true });
  }
  deleteBranch() {
    this.subscriptionsService.deleteBranch(this.subscriberId, this.branchModel.branchId).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.toaster.success(data.message);
        this.getBranchesData();
        this.formGroup?.reset();
        this.modalService.dismissAll();
        this.selectedFile = null;
      } else {
        this.toaster.error(data.message);
      }
      this.showAddLoader = false;
    });
  }

  getBranchesData() {
    this.showLoader = true;
    // this.searchFilterModel.searchText = this.searchText;
    this.subscriptionsService.getBranches(this.subscriberId, this.pagedResponse).subscribe(response => {
      this.pagedResponse.results = response.results;
      this.pagedResponse.totalCount = response.totalCount;
      this.usersData = response.results;
      this.selectedBranch = this.usersData?.length ? this.usersData[0] : null;
      this.totalCount = response.toDate;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  pageChanged(obj: any) {
    this.pagedResponse.currentPage = obj.page;
    this.getBranchesData();
  }

  onSelectedFile(event: any) {
    this.URLs = [];
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = (events: any) => {
        this.URLs.push(events.target.result);
      }
      // for (let x = 0; x < event.target.files.length; x++) {
      //   var reader = new FileReader();
      //   reader.readAsDataURL(event.target.files[x]);
      //   reader.onload = (events: any) => {
      //     this.URLs.push(events.target.result);
      //   }
      // }
    }
    // var files = event.target.files;
    // for (let i = 0; i < files.length; i++) {
    //   this.ImagesName.push(event.target.files[i].name);
    // }
  }
}

