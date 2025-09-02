import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'nw-sidebar',
  templateUrl: './nw-sidebar.component.html',
  styleUrls: ['./nw-sidebar.component.css'],
})
export class NwSidebarComponent implements OnInit {
  @Output() sidebarEvent = new EventEmitter<boolean>();
  @Input() isToggle;
  isScrolling = false;

  constructor() {}

  ngOnInit(): void {}

  onToggleSidebar() {
    this.sidebarEvent.emit();
  }
}
