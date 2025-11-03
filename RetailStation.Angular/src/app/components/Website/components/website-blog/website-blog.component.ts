import { Component, Input, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Auth/auth.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';

@Component({
  selector: 'app-website-blog',
  templateUrl: './website-blog.component.html',
  styleUrls: ['./website-blog.component.css'],
})
export class WebsiteBlogComponent implements OnInit {
  isCollapseContent = false;
  isCollapsing = false;
  UserModel: any;
  
  constructor(private modalService: NgbModal,
    private sharedService: SharedService,
    private authService: AuthService,
    private acRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private location: Location) { }

  ngOnInit(): void {
    this.UserModel = this.authService.getCurrentUser();
  }
  
  getStatusColor(status: string) {
    return {
      'green': status === 'Confirmed',
      'red': status === 'Cancelled',
      'blue': status === 'Pending'
    }
  }
}
