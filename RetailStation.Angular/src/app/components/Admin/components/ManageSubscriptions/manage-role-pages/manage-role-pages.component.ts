import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { RolesService } from 'src/app/Auth/roles.service';
import { ApplicationPageModel, PagePermissionModel, PageActionModel } from 'src/app/components/Shared/models/LoginResponseModel';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { RoleModel } from 'src/app/components/Shared/models/RoleModel';
import { SubscriptionsService } from '../../../services/subscriptions.service';


@Component({
  selector: 'app-manage-role-pages',
  templateUrl: './manage-role-pages.component.html',
  styleUrls: ['./manage-role-pages.component.css']
})
export class ManageRolePagesComponent implements OnInit {
  roleId: string;
  showLoader: boolean;
  activeId: string = '';
  pagedResponse: PagedResponseModel<RoleModel[]> = {
    currentPage: 1,
    pageSize: 25,
    results: [],
    filterList: [],
    searchText: ''
  }
  roleName: string = '';
  applicationPagesList: ApplicationPageModel[] = []
  constructor(private subscriptionsService: SubscriptionsService,
    private rolesService: RolesService,
    private acRouter: ActivatedRoute,
    private toaster: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.acRouter.params.subscribe((param: any) => {
      this.roleId = param.roleId;
      if (this.roleId)
        this.getSubscriberRolePages();
    });


  }
  activeTab = 'Summary';

  onTabClick(tab: string) {
    if (tab == 'Summary') {
      this.activeTab = 'Summary';
    }
    else if (tab == 'Details') {
      this.activeTab = 'Details';
    }
  }
  getSubscriberRolePages() {
    this.showLoader = true;
    this.rolesService.getSubscriberRolePages(this.roleId).subscribe((data: any) => {
      if (data?.length) {
        this.applicationPagesList = data;
        this.activeId = data[0].applicationId;
      }
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }
  selectPage(page: PagePermissionModel) {
    if (page.parentId && page?.actions?.some(x => x.isChecked)) {
      var parent = this.applicationPagesList.find(x => x.pages.some(y => y.pageId == page.parentId))?.pages.find(y => y.pageId == page.parentId)
      if (!parent?.actions?.some(x => x.isChecked) || !parent.isChecked)
        parent.actions?.map(x => x.isChecked = true)
      parent.isChecked = true;
    }
  }
  saveSubscriberRolePages() {
    var allPagesActions: PageActionModel[] = [];
    this.applicationPagesList.forEach(app => {
      allPagesActions = allPagesActions.concat(this.getAllCheckedActions(app.pages));
    });
    // if (allPagesActions.length <= 0) {
    //   this.toaster.error('Please Assign Any Action To This Role');
    //   return;
    // }
    let pagesActionIds = allPagesActions.map(s => Number(s.pageActionId));

    this.showLoader = true;
    this.rolesService.saveSubscriberRolePages(this.roleId, pagesActionIds).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.getSubscriberRolePages();
      } else {
        this.toaster.error(data.message);
      }
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  getAllCheckedActions(pages: PagePermissionModel[]): PageActionModel[] {
    return pages.flatMap(page => [
      ...page.actions.filter(action => action.isChecked),
      ...this.getAllCheckedActions(page.subPages || []),
    ]);
  }

}
