import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PagePermissionModel } from 'src/app/components/Shared/models/LoginResponseModel';

@Component({
  selector: 'app-permission-item',
  templateUrl: './permission-item.component.html',
  styleUrls: ['./permission-item.component.css']
})
export class PermissionItemComponent implements OnInit {
  expanded = false;
  @Input() page: PagePermissionModel;

  @Output() selectedPage = new EventEmitter<PagePermissionModel>();
  constructor() { }

  ngOnInit(): void {
    this.expanded = (this.page.isSelected && this.page.subPages.some(x => x.isSelected));
  }

  toggleNode(page: PagePermissionModel) {
    // page.isSelected =! page.isSelected
    this.expanded = !this.expanded;
  }

  onPageEvent(event: Event, page: PagePermissionModel) {
    const isChecked = (event.target as HTMLInputElement).checked;
    page.actions?.map(x => x.isChecked = isChecked)
    event.preventDefault();
    event.stopPropagation();
    this.selectPage(page);
  }

  onEvent(event: Event, page: PagePermissionModel) {
    // const isChecked = (event.target as HTMLInputElement).checked;
    // if(isChecked&&!page?.actions?.some(x=>x.isChecked))
    //   page.actions?.map(x => x.isChecked = isChecked)
    event.preventDefault();
    event.stopPropagation();
    this.selectPage(page);
  }

  selectPage(page: PagePermissionModel) {
    this.selectedPage.emit(page);
  }
}
