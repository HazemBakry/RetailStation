import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-change-quantity',
  templateUrl: './change-quantity.component.html',
  styleUrls: ['./change-quantity.component.css']
})
export class ChangeQuantityComponent implements OnInit {

  @Input() style: 'default'|'cart' = 'default';
  @Input() value!: number;
  @Input() minValue: number=1;
  @Output() valueChange = new EventEmitter<number>();

  ngOnInit(): void {
  }
  increment(): void {
    const newQuantity = this.value + 1;
    this.valueChange.emit(newQuantity);
  }

  decrement(): void {
    if (this.value > 1) {
      const newQuantity = this.value - 1;
      this.valueChange.emit(newQuantity);
    }
  }
  onQuantityChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = parseInt(inputElement.value, 10);

    if (isNaN(newQuantity) || newQuantity < this.minValue) {
      console.error('Invalid quantity entered. Quantity must be a positive number.');
      inputElement.value = this.value.toString();
      return;
    }

    this.valueChange.emit(newQuantity);
  }
}
