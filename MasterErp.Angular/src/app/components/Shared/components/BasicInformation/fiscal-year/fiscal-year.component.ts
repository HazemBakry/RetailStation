import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fiscal-year',
  templateUrl: './fiscal-year.component.html',
  styleUrls: ['./fiscal-year.component.css']
})
export class FiscalYearComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openEditModal(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

}
