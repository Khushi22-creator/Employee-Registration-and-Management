import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  alertInterval: any;
  employee = {
    name: '',
    role: '',
    dob: '',
    email: '',
    gender: '',
    country: '',
    joinDate: '',
    status: 'Active'
  };

  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchText: string = '';

  userRegistrations: any[] = [];
  viewType: string = 'employees';

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  duplicateName: boolean = false;
  duplicateEmail: boolean = false;

  notifications: string[] = [];
  alerts: string[] = [];
  showNotifications = false;
  showAlerts = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private cryptoService: CryptoService
  ) {}
  

  ngOnInit() {
    const loginTime = new Date();
    this.alerts.push(`Session started at ${loginTime.toLocaleString()}`);
  
    this.initializeDummyAlerts();
    this.encryptExistingEmployees(); 
  
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      const decryptedEmployees = this.cryptoService.decrypt(storedEmployees);
      this.employees = decryptedEmployees || [];
    }
  
    this.encryptExistingUserRegistrations();
    this.loadUserRegistrations();
    this.filterEmployees();
  
    this.alertInterval = setInterval(() => {
      this.addDummyAlert();
    }, 30000); 
  }
  
  encryptExistingEmployees() {
    const existing = localStorage.getItem('employees');
    if (existing && !existing.startsWith('U2FsdGVkX1')) {
      const parsed = JSON.parse(existing);
      const encrypted = this.cryptoService.encrypt(parsed);
      localStorage.setItem('employees', encrypted);
      console.log('Employees encrypted and saved.');
    }
  }

  encryptExistingUserRegistrations() {
    const existing = localStorage.getItem('userRegistrations');
    if (existing && !existing.startsWith('U2FsdGVkX1')) {
      const parsed = JSON.parse(existing);
      const encrypted = this.cryptoService.encrypt(parsed);
      localStorage.setItem('userRegistrations', encrypted);
      console.log('User registrations encrypted and saved.');
    }
  }  
  
  loadUserRegistrations() {
    const storedUsers = localStorage.getItem('userRegistrations');
    if (storedUsers) {
      const decryptedUsers = this.cryptoService.decrypt(storedUsers);
      this.userRegistrations = decryptedUsers || [];
    }
  }  

  saveUserRegistrationsToLocalStorage() {
    const encrypted = this.cryptoService.encrypt(this.userRegistrations);
    localStorage.setItem('userRegistrations', encrypted);
  }  
  
  changeView(view: string) {
    this.viewType = view;
    if (view === 'employees') {
      this.filterEmployees();
    } else if (view === 'users') {
      this.loadUserRegistrations();
    }
  }  


  removeEmployee(index: number) {
    const confirmed = confirm('Are you sure you want to delete this employee?');
    if (!confirmed) return;

    const removedEmployee = this.employees[index];
    const now = new Date();
    this.notifications.push(`Employee "${removedEmployee.name}" removed on ${now.toDateString()} at ${now.toLocaleTimeString()}`);

    this.employees.splice(index, 1);
    this.saveToLocalStorage();
    this.filterEmployees();
  }

  filterEmployees() {
    let filtered = this.employees.filter(emp =>
      (!this.employeeSearch.name || emp.name.toLowerCase().includes(this.employeeSearch.name.toLowerCase())) &&
      (!this.employeeSearch.role || emp.role.toLowerCase().includes(this.employeeSearch.role.toLowerCase())) &&
      (!this.employeeSearch.email || emp.email.toLowerCase().includes(this.employeeSearch.email.toLowerCase())) &&
      (!this.employeeSearch.dob || emp.dob.includes(this.employeeSearch.dob)) &&
      (!this.employeeSearch.gender || emp.gender.toLowerCase().includes(this.employeeSearch.gender.toLowerCase())) &&
      (!this.employeeSearch.country || emp.country.toLowerCase().includes(this.employeeSearch.country.toLowerCase())) &&
      (!this.employeeSearch.joinDate || emp.joinDate.includes(this.employeeSearch.joinDate)) &&
      (!this.employeeSearch.status || emp.status.toLowerCase().includes(this.employeeSearch.status.toLowerCase()))
    );
  
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    this.updatePaginatedEmployees(filtered);
  }

  get filteredUsers() {
    return this.userRegistrations.filter(user =>
      (!this.userSearch.firstName || user.firstName.toLowerCase().includes(this.userSearch.firstName.toLowerCase())) &&
      (!this.userSearch.lastName || user.lastName.toLowerCase().includes(this.userSearch.lastName.toLowerCase())) &&
      (!this.userSearch.email || user.email.toLowerCase().includes(this.userSearch.email.toLowerCase())) &&
      (!this.userSearch.phone || user.phone.includes(this.userSearch.phone)) &&
      (!this.userSearch.role || user.role.toLowerCase().includes(this.userSearch.role.toLowerCase())) &&
      (!this.userSearch.isActive || (user.isActive ? 'yes' : 'no').includes(this.userSearch.isActive.toLowerCase())) &&
      (!this.userSearch.idProof || (user.idProof?.name || '').toLowerCase().includes(this.userSearch.idProof.toLowerCase())) &&
      (!this.userSearch.addressProof || (user.addressProof?.name || '').toLowerCase().includes(this.userSearch.addressProof.toLowerCase()))
    );
  }
  
  updatePaginatedEmployees(filtered: any[]) {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredEmployees = filtered.slice(start, end);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterEmployees();
    }
  }

  saveToLocalStorage() {
    const encrypted = this.cryptoService.encrypt(this.employees);
    localStorage.setItem('employees', encrypted);
  }
  

  logout() {
    localStorage.removeItem('loggedIn');
    this.router.navigate(['/login']);
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showAlerts = false;
  }

  toggleAlerts() {
    this.showAlerts = !this.showAlerts;
    this.showNotifications = false;
  }

  closePanel() {
    this.showAlerts = false;
    this.showNotifications = false;
  }

  removeUserRegistration(index: number) {
    const confirmed = confirm('Are you sure you want to delete this registration?');
    if (!confirmed) return;
  
    const removedUser = this.userRegistrations[index];
  
    const now = new Date();
    this.notifications.push(`User Registration "${removedUser.firstName} ${removedUser.lastName}" removed on ${now.toDateString()} at ${now.toLocaleTimeString()}`);
  
    this.userRegistrations.splice(index, 1);
    this.saveUserRegistrationsToLocalStorage();
  }

  editUser(user: any) {
    const index = this.userRegistrations.indexOf(user);
  
    localStorage.removeItem('viewUser'); 
    localStorage.setItem('editUser', JSON.stringify(user));
    localStorage.setItem('editUserIndex', JSON.stringify(index));
  
    this.router.navigate(['/form']);
  }
  
  
  employeeSearch = {
    name: '',
    role: '',
    email: '',
    dob: '',
    gender: '',
    country: '',
    joinDate: '',
    status: ''
  };
  
  userSearch = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    isActive: '',
    idProof: '',
    addressProof: ''
  };
  
  viewUser(user: any) {
    localStorage.removeItem('editUser'); 
    localStorage.removeItem('editUserIndex');
    localStorage.setItem('viewUser', JSON.stringify(user));
    this.router.navigate(['/form']);
  }
  
  alertJson = [
    {
      Modulename: "core",
      Screens: [
        { Screen: "user", Date: new Date().toISOString(), Message: "user created", requestID: 1 },
        { Screen: "scheduler", Date: new Date().toISOString(), Message: "user created", requestID: 2 }
      ]
    },
    {
      Modulename: "CAPEI",
      Screens: [
        { Screen: "intake", Date: new Date().toISOString(), Message: "form created", requestID: 3 },
        { Screen: "scheduler", Date: new Date().toISOString(), Message: "user created", requestID: 4 }
      ]
    }
  ];

  initializeDummyAlerts() {
    this.alertJson = [
      {
        Modulename: "Authentication",
        Screens: [
          { Screen: "user", Date: new Date().toISOString(), Message: "user created", requestID: 1 },
          { Screen: "scheduler", Date: new Date().toISOString(), Message: "user created", requestID: 2 }
        ]
      },
      {
        Modulename: "Employee Management",
        Screens: [
          { Screen: "intake", Date: new Date().toISOString(), Message: "form created", requestID: 3 },
          { Screen: "scheduler", Date: new Date().toISOString(), Message: "user created", requestID: 4 }
        ]
      }
    ];
  }
  
  
  addDummyAlert() {
    const newAlert = {
      Screen: "auto-added",
      Date: new Date().toISOString(),
      Message: "This is an auto-added alert",
      requestID: Date.now() 
    };
  
    this.alertJson[0].Screens.push(newAlert);
  }
  
  getAlertCount(): number {
    return this.alertJson.reduce((acc, module) => acc + module.Screens.length, 0);
  }  
  
  ngOnDestroy() {
    if (this.alertInterval) {
      clearInterval(this.alertInterval);
    }
  }

  isToday(dateStr: string | undefined): boolean {
    if (!dateStr) return false;
    const today = new Date();
    const date = new Date(dateStr);
    return date.toDateString() === today.toDateString();
  }
  
  isYesterday(dateStr: string | undefined): boolean {
    if (!dateStr) return false;
    const today = new Date();
    const date = new Date(dateStr);
  
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    return date.toDateString() === yesterday.toDateString();
  }
  
  hasTodayScreens(screens: any[]): boolean {
    if (!Array.isArray(screens)) return false;
    return screens.some(screen => this.isToday(screen.Date));
  }
  
  hasYesterdayScreens(screens: any[]): boolean {
    if (!Array.isArray(screens)) return false;
    return screens.some(screen => this.isYesterday(screen.Date));
  } 
  
  notificationJson = [
    {
      Modulename: "Authentication",
        Screens: [
          { Screen: "user", Date: new Date().toISOString(), Message: "user created", requestID: 1 },
          { Screen: "scheduler", Date: new Date().toISOString(), Message: "user created", requestID: 2 }
        ]
      },
      {
        Modulename: "Employee Management",
        Screens: [
          { Screen: "intake", Date: new Date().toISOString(), Message: "form created", requestID: 3 },
          { Screen: "scheduler", Date: new Date().toISOString(), Message: "user created", requestID: 4 }
        ]
        }
      ]
      
 }
  
