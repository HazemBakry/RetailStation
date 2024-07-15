import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemSettingsLayoutComponent } from './system-settings-layout.component';
import { SystemSettingsHomeComponent } from './components/system-settings-home/system-settings-home.component';

const routes: Routes = [
  {
    path: '',
    component: SystemSettingsLayoutComponent,
    children: [

      { path: 'home', component: SystemSettingsHomeComponent },
      { path: '', redirectTo: 'home' ,pathMatch: 'full' },
      
      
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemSettingsRoutingModule { }
