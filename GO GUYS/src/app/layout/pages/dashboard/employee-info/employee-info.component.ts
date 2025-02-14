import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss']
})
export class EmployeeInfoComponent implements OnInit {
  searchQuery: string = '';
  employees: any[] = [];
  filteredEmployees: any[] = [];
  selectedEmployee: any = null;
  isEditing: boolean = false;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.firestore.collection('employees').snapshotChanges().subscribe(data => {
      this.employees = data.map(e => {
        return { id: e.payload.doc.id, ...e.payload.doc.data() as any };
      });
      this.filteredEmployees = [...this.employees];
    });
  }

  searchEmployee(query: string) {
    this.filteredEmployees = query
      ? this.employees.filter(emp => emp.name.toLowerCase().includes(query.toLowerCase()))
      : [...this.employees];
  }

  openModal(employee: any) {
    this.selectedEmployee = { ...employee };
    this.isEditing = false;
  }

  enableEditing() {
    this.isEditing = true;
  }

  saveUpdate() {
    if (this.selectedEmployee.id) {
      this.firestore.collection('employees').doc(this.selectedEmployee.id).update(this.selectedEmployee)
        .then(() => {
          alert('Employee updated successfully!');
          this.isEditing = false;
        })
        .catch(error => console.error('Error updating employee:', error));
    }
  }

  closeModal() {
    this.selectedEmployee = null;
  }
}
