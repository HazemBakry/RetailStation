import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { PaymentService } from '../../services/payment.service';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel } from 'src/app/components/Inventory/models/inventory';
import { ReceiveReceipt } from '../../models/GeneralAccounts/ReceiveReceipt';
import { ReceiptModel } from '../../models/GeneralAccounts/ReceiptModel';
import { ActivatedRoute } from '@angular/router';
import { MenuService, MenuType } from 'src/app/components/Shared/services/menu.service';
import { MenuSidebarItem } from 'src/app/components/Shared/models/MenuSidebarItem';

@Component({
  selector: 'app-general-accounts-home',
  templateUrl: './general-accounts-home.component.html',
  styleUrls: ['./general-accounts-home.component.css']
})
export class GeneralAccountsHomeComponent implements OnInit {

  dashboardFilterList = ['الأكثر شهرة', 'الأعلى تقييماً', 'الأسرع في التوصيل'];
  showLoader: boolean = false;
  selectedTabName: string;
  menuItem:MenuSidebarItem;
  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private generalAccountService: GeneralAccountService,
    private purchaseService: PurchaseService,
    private menuService: MenuService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
   
    this.route.params.subscribe(params => {
      this.menuItem=null;
      if (params['tabName']) {
        console.log(params['tabName']);
        this.selectedTabName = params['tabName'];
        this.menuItem=this.menuService.getMenuById(MenuType.GeneralAccountsHome,this.selectedTabName);
      }
    });

  }

}

