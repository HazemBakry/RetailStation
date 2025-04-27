import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-next-previous',
  templateUrl: './next-previous.component.html',
  styleUrls: ['./next-previous.component.css']
})
export class NextPreviousComponent implements OnInit {

  @Input() nextId: number;
  @Input() previousId: number;
  @Output() valueChanged = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }
  emitValue(id: number) {
    this.valueChanged.emit(id);
  }
}
