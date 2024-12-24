import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-design-layout',
  templateUrl: './design-layout.component.html',
  styleUrls: ['./design-layout.component.css']
})
export class DesignLayoutComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }


  open(content: any) {
		this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
	}

}
