import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GeneralAccountService } from 'src/app/components/GeneralAccounts/services/general-account.service';
import { MenuSidebarItem } from 'src/app/components/Shared/models/MenuSidebarItem';
import { MenuService, MenuType } from 'src/app/components/Shared/services/menu.service';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory-home',
  templateUrl: './inventory-home.component.html',
  styleUrls: ['./inventory-home.component.css']
})
export class InventoryHomeComponent implements OnInit {
  dashboardFilterList = ['الأكثر شهرة', 'الأعلى تقييماً', 'الأسرع في التوصيل'];
  showLoader: boolean = false;
  selectedTabName: string;
  menuItem: MenuSidebarItem;
  statisticsCardList: any[] = [];

  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private menuService: MenuService,
    private toaster: ToastrService) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.menuItem = null;
      if (params['tabName']) {
        console.log(params['tabName']);
        this.selectedTabName = params['tabName'];
        this.menuItem = this.menuService.getMenuById(MenuType.InventoryHome, this.selectedTabName);
      }
    });
    this.getInventoryStatistics();
  }

  getInventoryStatistics() {
    this.inventoryService.GetInventoryStatistics().subscribe(data => {
      this.statisticsCardList = data;
    });
  }

}

