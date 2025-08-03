import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { HRWorkflowStatus, WorkflowStatusGroup } from "src/app/components/Shared/Enums/FinanceWorkflowStatus";
import { FilterItem } from "src/app/components/Shared/models/FilterModel";
import { PagedResponseDTO } from "src/app/components/Shared/models/PagedResponseDTO";
import { GeneralSelectorModel } from "src/app/components/Shared/components/general-selector/general-selector.component";
import { SharedService } from "src/app/components/Shared/services/shared.service";
import { LookupService } from "src/app/components/Shared/services/lookup.service";
import { ItemModel } from "../../models/Item";
import { InventoryService } from "../../services/inventory.service";


@Component({
  selector: 'app-received-items-report',
  templateUrl: './received-items-report.component.html',
  styleUrls: ['./received-items-report.component.css']
})
export class ReceivedItemsReportComponent implements OnInit {
  TitleList = ['المخازن', 'تقرير الأصناف المستلمة'];
  ngOnInit(): void {
  }



}
