import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-design-latest-header',
  templateUrl: './design-latest-header.component.html',
  styleUrls: ['./design-latest-header.component.css'],
})
export class DesignLatestHeaderComponent implements OnInit {
  collapsed = true;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, {
      size: 'xl',
      centered: true,
      scrollable: true,
    });
  }
}
