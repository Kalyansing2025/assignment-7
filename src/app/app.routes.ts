import { Routes } from '@angular/router';
import { LeadManagementComponent } from './lead-management/lead-management.component';
import { DemoComponent } from './demo/demo.component';
import { LoadingComponent } from './loading/loading.component'; // Correct import

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: LeadManagementComponent },
  { path: 'lead', component: LeadManagementComponent },
  { path: 'demo', component: DemoComponent },
  { path: 'loading', component: LoadingComponent }, // Correct usage
];
