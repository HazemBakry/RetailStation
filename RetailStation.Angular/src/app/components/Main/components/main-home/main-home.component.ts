import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralAccountService } from 'src/app/components/GeneralAccounts/services/general-account.service';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { MenuSidebarItem } from 'src/app/components/Shared/models/MenuSidebarItem';
import { MenuService, MenuType } from 'src/app/components/Shared/services/menu.service';

@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.css']
})
export class MainHomeComponent implements OnInit {
  showLoader: boolean = false;
  selectedTabName: string;
  menuItem: MenuSidebarItem;
  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private generalAccountService: GeneralAccountService,
    private purchaseService: PurchaseService,
    private menuService: MenuService,
    private toaster: ToastrService) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.menuItem = null;
      if (params['tabName']) {
        this.selectedTabName = params['tabName'];
        this.menuItem = this.menuService.getMenuById(MenuType.GeneralAccountsHome, this.selectedTabName);
      }
    });
  }


}
