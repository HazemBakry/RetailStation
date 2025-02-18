import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-design-home',
  templateUrl: './design-home.component.html',
  styleUrls: ['./design-home.component.css'],
})
export class DesignHomeComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  open(content: any) {
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      scrollable: true,
    });
  }
}
