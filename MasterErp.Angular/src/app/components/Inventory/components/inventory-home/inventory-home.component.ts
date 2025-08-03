import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { MenuSidebarItem } from 'src/app/components/Shared/models/MenuSidebarItem';
import { MenuService, MenuType } from 'src/app/components/Shared/services/menu.service';
import { InventoryService } from '../../services/inventory.service';
import { DatePipe } from '@angular/common';
import { GeneralAccountService } from 'src/app/components/GeneralAccounts/services/general-account.service';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';

@Component({
  selector: 'app-inventory-home',
  templateUrl: './inventory-home.component.html',
  styleUrls: ['./inventory-home.component.css']
})
export class InventoryHomeComponent implements OnInit {
@ViewChild('chartBox') chartBox!: ElementRef<HTMLElement>;

  dashboardFilterList = ['الأكثر شهرة', 'الأعلى تقييماً', 'الأسرع في التوصيل'];
  showLoader: boolean = false;
  selectedTabName: string;
  menuItem: MenuSidebarItem;
  statisticsCardList: any;

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
    private purchaseService: PurchaseService,
    private menuService: MenuService,
    private toaster: ToastrService) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.menuItem = null;
      if (params['tabName']) {
        this.selectedTabName = params['tabName'];
        this.menuItem = this.menuService.getMenuById(MenuType.InventoryHome, this.selectedTabName);
      }
    });
    this.getGeneralAccountsStatistics();
  }

  getGeneralAccountsStatistics() {
  //   this.showLoader = true;
  //   this.generalAccountService.GetGeneralAccounts_Statistics().subscribe(data => {
  //     if (data && data.length > 0)
  //       this.statisticsCardList = data[0];
  //     this.showLoader = false;
  //   }, err => {
  //     this.showLoader = false;
  //   }, () => {
  //     this.showLoader = false;
  //   });
   }
}
