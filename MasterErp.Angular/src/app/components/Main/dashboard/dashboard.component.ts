import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  statsList = [
    {
      title: 'Orders Received',
      icon: 'uil-shopping-cart-alt',
      number: 486,
      orderName: 'Completed Orders',
      orderNumber: 351,
    },
    {
      title: 'Total Sales',
      icon: 'uil-tag-alt',
      number: 1641,
      orderName: 'This Month',
      orderNumber: 216,
    },
    {
      title: 'Revenue',
      icon: 'uil-repeat',
      number: '$42,562',
      orderName: 'This Month',
      orderNumber: '$5,032',
    },
    {
      title: 'Total Profit',
      icon: 'uil uil-award',
      number: '$9,562',
      orderName: 'This Month',
      orderNumber: '$542',
    },
  ];

  orders = []
  dashboardFilterList = ['الأكثر شهرة', 'الأعلى تقييماً', 'الأسرع في التوصيل'];
  activeFilter: number;
  FromDate = new Date();
  ToDate = new Date();
  branchId = 0;
  SalesSummaryStatistics:any;


  constructor(private modalService: NgbModal,private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.GetSalesSummary();
  }

  GetSalesSummary(){
    // let FromDate = this.datepipe.transform(this.FromDate, 'yyyy-MM-dd');
    // let ToDate = this.datepipe.transform(this.ToDate, 'yyyy-MM-dd');
    // this.AdminService.GetSalesSummary(FromDate,ToDate,this.branchId).subscribe(data => {
    //   this.SalesSummaryStatistics = data[0];
    // });
  }
  // Modal Function
  closeResultModal = '';
  openModal(content: any) {
    this.modalService.open(content, { centered: true, scrollable: true, size: 'xl' })
  }


}
