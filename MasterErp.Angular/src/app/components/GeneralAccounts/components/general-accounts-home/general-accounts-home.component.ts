import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('chartBox') chartBox!: ElementRef<HTMLElement>;

  dashboardFilterList = ['الأكثر شهرة', 'الأعلى تقييماً', 'الأسرع في التوصيل'];
  showLoader: boolean = false;
  selectedTabName: string;
  menuItem: MenuSidebarItem;
  statisticsCardList: any[] = [];

  columnChartType = 'ColumnChart';
  columnChartData = [
    ['يناير', 600, 230],
    ['فبراير', 1170, 700],
    ['مارس', 800, 880],
    ['أبريل', 1300, 900],
    ['مايو', 400, 700],
    ['يونيو', 900, 1000],
    ['يوليو', 200, 700],
    ['أغسطس', 1200, 550],
    ['سبتمبر', 470, 789],
    ['أكتوبر', 300, 900],
    ['نوفمبر', 250, 800],
    ['ديسمبر', 500, 1100],
  ];
  columnChartNames = ['الشهور', 'النسب', 'الارقام'];
  columnChartOptions = {
    colors: ['#8dd3c7', '#fbbf72'],
    backgroundColor: 'transparent',
    chartArea: {
      width: '70%',
      backgroundColor: 'transparent',
    },
    hAxis: {
      title: 'الشهور',
    },
    vAxis: {
      title: 'النتائج',
    },
    legend: {
      // position: 'bottom',
      alignment: 'center',
    },
    isStacked: true,
  };
  columnChartWidth = (window.innerWidth * 0.95) / 1.4;
  columnChartHeight = window.innerHeight * 0.4;

  parentChartWidth!: number;
  isToggle = false;

  onToggleContent() {
    this.isToggle = !this.isToggle;
    const htmlElement = document.querySelector('html');
    if (this.isToggle) {
      htmlElement.style.cssText = `overflow: hidden`;
    } else {
      htmlElement.style.cssText = `overflow: auto`;
    }
  }

  onOverlayClicked() {
    this.isToggle = false;
    const htmlElement = document.querySelector('html');
    htmlElement.style.cssText = `overflow: auto`;
  }


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
    this.getGeneralAccountsStatistics();
  }

  getGeneralAccountsStatistics() {
    this.generalAccountService.GetGeneralAccounts_Statistics().subscribe(data => {
      this.statisticsCardList = data;
    },
      (error) => { console.log("error", error); }, () => { });
  }
}

