import { Routes } from '@angular/router';
import { LeadManagementComponent } from './lead-management/lead-management.component';
import { DemoComponent } from './demo/demo.component';


export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: LeadManagementComponent }, 
  { path: 'lead', component: LeadManagementComponent },
  {path:'demo', component: DemoComponent},
  

];
