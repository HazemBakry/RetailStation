import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralAccountService } from '../../services/general-account.service';

@Component({
  selector: 'app-account-tree',
  templateUrl: './account-tree.component.html',
  styleUrls: ['./account-tree.component.css']
})
export class AccountTreeComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openModal(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

}
