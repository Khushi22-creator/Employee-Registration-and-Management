import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';  
import { AboutComponent } from './about/about.component'; 
import { LoginComponent } from './login/login.component';
import { EmployeesComponent } from './employees/employees.component';
import { FormComponent } from './form/form.component'; 
import { Form2Component } from './form2/form2.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard] }, 
  { path: 'form', component: FormComponent, canActivate: [AuthGuard] },
  { path: 'form2', component: Form2Component, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
