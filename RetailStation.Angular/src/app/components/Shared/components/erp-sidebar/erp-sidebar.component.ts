import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'erp-sidebar',
  templateUrl: './erp-sidebar.component.html',
  styleUrls: ['./erp-sidebar.component.css'],
})
export class ERPSidebarComponent implements OnInit {
  @Output() sidebarEvent = new EventEmitter<boolean>();
  @Input() isToggle;
  isScrolling = false;

  constructor() {}

  ngOnInit(): void {}

  onToggleSidebar() {
    this.sidebarEvent.emit();
  }
}
