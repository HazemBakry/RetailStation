import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { RoleModel } from 'src/app/components/Shared/models/RoleModel';
import { SubscriptionsService } from '../../../services/subscriptions.service';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  TitleList = ['Subscriber', 'Roles'];
  showLoader: boolean;
  pagedResponse: PagedResponseModel<RoleModel[]> = {
    currentPage: 1,
    pageSize: 25,
    results: [],
    filterList: [],
    searchText: ''
  }
  roleName: string = '';
  isUpdate:boolean=false;
  constructor(private subscriptionsService: SubscriptionsService, private toaster: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.GetRoles();
  }

  GetRoles() {
    this.showLoader = true;
    this.subscriptionsService.getRoles(this.pagedResponse).subscribe((data: any) => {

      this.pagedResponse.results = data.results;
      this.pagedResponse.totalCount = data.totalCount;
      this.pagedResponse.currentPage = data.currentPage;
      this.pagedResponse.pageSize = data.pageSize;
      this.pagedResponse.totalPages = data.totalPages;

      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }
  openAddModal(content: any) {
    this.roleName = '';
    this.modalService.open(content, { size: 'md', centered: true });
  }
  addNewRole() {
    if (!this.roleName || this.roleName?.length < 3) {
      this.toaster.warning('Please enter a role name and must be at least 3 characters');
      return
    }
    this.showLoader = true;
    this.subscriptionsService.addNewRole(this.roleName).subscribe((data: ActionsResponseModel) => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.modalService?.dismissAll();
        this.GetRoles();
      }
      else {
        this.toaster.error(data.message);
      }
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }
  pageChanged(obj: any) {
    this.pagedResponse.currentPage = obj.page;
    this.GetRoles();
  }

}
