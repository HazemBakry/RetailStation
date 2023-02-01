import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openEditModal(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

}
