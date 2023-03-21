import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-receipt-books',
  templateUrl: './receipt-books.component.html',
  styleUrls: ['./receipt-books.component.css']
})
export class ReceiptBooksComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openEditModal(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

}
