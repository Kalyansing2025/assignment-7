import { Routes } from '@angular/router';
import { LeadManagementComponent } from './lead-management/lead-management.component';
import { LoadingComponent } from './loading/loading.component'; 

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: LeadManagementComponent },
  { path: 'lead', component: LeadManagementComponent },
  { path: 'loading', component: LoadingComponent }, 
];
