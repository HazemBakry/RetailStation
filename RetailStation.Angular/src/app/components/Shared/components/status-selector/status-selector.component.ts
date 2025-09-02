import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { GeneralSelectorModel } from '../general-selector/general-selector.component';

@Component({
  selector: 'app-status-selector',
  templateUrl: './status-selector.component.html',
  styleUrls: ['./status-selector.component.css']
})
export class StatusSelectorComponent implements OnInit {


  @Input() statusList: GeneralSelectorModel[] = [
    { value: 1, name: 'Approved' },
    { value: 2, name: 'Rejected' },
    { value: 3, name: 'In Progress' },
  ];
  @Input() selectedStatusId?: number = null;
  @Input() type?: string = 'employeeStatus';

  @Output() statusSelected = new EventEmitter<GeneralSelectorModel>();


  ngOnInit(): void {

  }
  get selectedStatus(): GeneralSelectorModel | undefined {
    return this.statusList.find(s => s.value == this.selectedStatusId);
  }

  selectStatus(status: GeneralSelectorModel) {
    if (status.value !== this.selectedStatusId) {
      this.statusSelected.emit(status);
    }
  }

}
