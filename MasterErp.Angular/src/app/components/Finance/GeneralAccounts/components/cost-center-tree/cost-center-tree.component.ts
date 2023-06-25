import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cost-center-tree',
  templateUrl: './cost-center-tree.component.html',
  styleUrls: ['./cost-center-tree.component.css']
})
export class CostCenterTreeComponent implements OnInit {
  
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openModal(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
}
