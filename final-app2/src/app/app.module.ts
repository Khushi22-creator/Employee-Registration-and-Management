import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //added
import { InputTextModule } from 'primeng/inputtext'; //added
import { ButtonModule } from 'primeng/button'; //added
import { TableModule } from 'primeng/table'; //added

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeesComponent } from './employees/employees.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { FormComponent } from './form/form.component';
import { Form2Component } from './form2/form2.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent,
    LoginComponent,
    HomeComponent,
    AboutComponent,
    FormComponent,
    Form2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,// added
    InputTextModule, //added
    ButtonModule, // added
    TableModule, // added
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
