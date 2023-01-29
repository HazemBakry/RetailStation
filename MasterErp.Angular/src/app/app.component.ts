import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  toggler = false;
  onToggler() {
    this.toggler = !this.toggler;
    console.log(this.toggler);
  }
}
