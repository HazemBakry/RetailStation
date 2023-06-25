import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsTreeComponent } from './components/accounts-tree/accounts-tree.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from "ngx-loading";
import { SearchArryPipe } from './Pipes/search-arry.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AccountsTreeComponent,
    StatsCardComponent,
    SearchArryPipe
  ],

  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0, 18, 59, 0.6)',
      backdropBorderRadius: '3px',
      primaryColour: '#337AB7',
      secondaryColour: 'silver',
      tertiaryColour: '#ffffff',
      fullScreenBackdrop: true
    })
  ],

  exports:[
    AccountsTreeComponent,
    NgxLoadingModule,
    SearchArryPipe
  ]
})
export class SharedModule { }
