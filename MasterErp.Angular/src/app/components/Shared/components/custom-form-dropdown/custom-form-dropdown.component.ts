import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-form-dropdown',
  templateUrl: './custom-form-dropdown.component.html',
  styleUrls: ['./custom-form-dropdown.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomFormDropdownComponent),
      multi: true,
    },
  ],
})
export class CustomFormDropdownComponent implements OnInit {
  @Input() data: any[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    // Add more options as needed
  ];

  
  filteredData: any[] = [];
  searchText: string = '';
  selectedValue: any='select';
  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: any): void {
    this.selectedValue = value;
    // this.filterData(); // Ensure filteredData is updated based on the initial value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }

  // filterData(): void {
  //   this.filteredData = this.data.filter(
  //     (option) =>
  //       option.label.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }

  selectOption(option: any): void {
    this.selectedValue = option.value;
    this.searchText = option.label;
    this.filteredData = []; // Clear the filteredData
    this.onChange(this.selectedValue);
    this.onTouched();
  }


  // selectedValue: any=null;
  // private onChange: any = () => {};
  // private onTouched: any = () => {};

  // constructor() { }

  ngOnInit(): void {
  }


  // writeValue(value: any): void {
  //   this.selectedValue = value;
  // }

  // registerOnChange(fn: any): void {
  //   this.onChange = fn;
  // }

  // registerOnTouched(fn: any): void {
  //   this.onTouched = fn;
  // }

  // setDisabledState?(isDisabled: boolean): void {
  //   // Implement if needed
  // }

  // onSelectionChange(): void {
  //   this.onChange(this.selectedValue);
  //   this.onTouched();
  // }

}
