import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


interface Field {
  label: string;
  name: string;
  type: string;
  required: boolean;
  validators?: string[];
  options?: string[];
}

interface Section {
  section: string;
  fields: Field[];
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  formSections: Section[] = [
    {
      section: 'User Details',
      fields: [
        { label: 'First Name', name: 'firstName', type: 'text', required: true },
        { label: 'Last Name', name: 'lastName', type: 'text', required: true },
        { label: 'Email', name: 'email', type: 'email', required: true, validators: ['email'] },
        { label: 'Phone', name: 'phone', type: 'tel', required: false }
      ]
    },
    {
      section: 'Access Settings',
      fields: [
        { label: 'Role', name: 'role', type: 'dropdown', required: true, options: ['Admin', 'User', 'Manager'] },
        { label: 'Is Active', name: 'isActive', type: 'checkbox', required: false }
      ]
    },
    {
      section: 'Documents',
      fields: [
        { label: 'Upload ID Proof', name: 'idProof', type: 'file', required: true },
        { label: 'Upload Address Proof', name: 'addressProof', type: 'file', required: false }
      ]
    }
  ];

  isViewMode: boolean = false;

  form!: FormGroup;
  submitted = false;
  formSuccess = false;

  constructor(private fb: FormBuilder, private router: Router) {}


  ngOnInit(): void {
    const group: any = {};
  
    for (const section of this.formSections) {
      for (const field of section.fields) {
        const validators = [];
  
        if (field.required) validators.push(Validators.required);
        if (field.validators?.includes('email')) validators.push(Validators.email);
        if (field.name === 'firstName') validators.push(Validators.maxLength(10));
  
        group[field.name] = [{ value: '', disabled: false }, validators];
      }
    }
  
    this.form = this.fb.group(group);
  
    const editUser = localStorage.getItem('editUser');
    const viewUser = localStorage.getItem('viewUser');
  
    
    if (viewUser) {
      const userData = JSON.parse(viewUser);
      this.form.patchValue(userData, { emitEvent: false });
      this.form.disable();
      this.isViewMode = true;
      return;
    }
  
   
    if (editUser) {
      const userData = JSON.parse(editUser);
      this.form.patchValue(userData, { emitEvent: false });
      this.form.markAsPristine();
    }
  }  
  
   
  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.form.get(controlName)?.setErrors({ invalidFileType: true });
      } else {
        this.form.get(controlName)?.setValue(file);
      }
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSuccess = true;
  
      const existing = JSON.parse(localStorage.getItem('userRegistrations') || '[]');
      const editUserIndex = localStorage.getItem('editUserIndex');
  
      if (editUserIndex !== null) {
        const index = parseInt(editUserIndex, 10);
        existing[index] = this.form.value;
      } else {
        existing.push(this.form.value);
      }
  
      localStorage.setItem('userRegistrations', JSON.stringify(existing));
      localStorage.removeItem('editUser');
      localStorage.removeItem('editUserIndex');
  
      console.log('Form submitted:', this.form.value);
      this.form.reset();
  
      setTimeout(() => {
        this.formSuccess = false;
      }, 4000);
    } else {
      this.formSuccess = false;
      this.form.markAllAsTouched();
    }

    
  }  
  
  onDragStart(event: DragEvent, fieldName: string): void {
    const value = this.form.get(fieldName)?.value;
    if (value) {
      event.dataTransfer?.setData('text/plain', value);
    }
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Allow drop
  }
  
  onDrop(event: DragEvent, targetField: string): void {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text/plain');
    if (data !== undefined && this.form.get(targetField)) {
      this.form.get(targetField)?.setValue(data);
      this.form.get(targetField)?.markAsDirty();
    }
  }

  startNewForm(): void {
    localStorage.removeItem('editUser');
    localStorage.removeItem('editUserIndex');
    localStorage.removeItem('viewUser');
  
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/form']);
    });
  }
  
  
  
}  
