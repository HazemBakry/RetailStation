import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() toggler = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  onToggler() {
    this.toggler.emit();
    console.log(this.toggler);
  }

}
