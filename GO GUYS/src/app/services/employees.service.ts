import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuditLogService } from './audit-log.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private collectionName = 'employees';

  constructor(private firestore: AngularFirestore, private auditLogService: AuditLogService) {}

  /** ✅ Get Employees */
  getEmployees() {
    return this.firestore.collection(this.collectionName).valueChanges({ idField: 'id' });
  }

  /** ✅ Get Employee By ID */
  getEmployeeById(employeeId: string) {
    return this.firestore.collection(this.collectionName).doc(employeeId).valueChanges();
  }

  /** ✅ Onboard Employee */
  async onboardEmployee(employeeData: any) {
    try {
      const newEmployee = await this.firestore.collection(this.collectionName).add(employeeData);
      await this.auditLogService.logAction('ONBOARD_EMPLOYEE', `New employee added: ${newEmployee.id}`, 'Successful');
      return { success: true, message: 'Employee onboarded successfully' };
    } catch (error: any) {
      await this.auditLogService.logAction('ONBOARD_EMPLOYEE', `Failed to onboard employee: ${error.message}`, 'Failed');
      return { success: false, message: error.message };
    }
  }

  /** ✅ Update Employee */
  async updateEmployee(employeeId: string, updatedData: any) {
    try {
      await this.firestore.collection(this.collectionName).doc(employeeId).update(updatedData);
      await this.auditLogService.logAction('UPDATE_EMPLOYEE', `Employee updated: ${employeeId}`, 'Successful');
      return { success: true, message: 'Employee updated successfully' };
    } catch (error: any) {
      await this.auditLogService.logAction('UPDATE_EMPLOYEE', `Failed to update employee: ${error.message}`, 'Failed');
      return { success: false, message: error.message };
    }
  }

  /** ✅ Offboard Employee */
  async offboardEmployee(employeeId: string) {
    try {
      await this.firestore.collection(this.collectionName).doc(employeeId).update({ status: 'Offboarded' });
      await this.auditLogService.logAction('OFFBOARD_EMPLOYEE', `Employee offboarded: ${employeeId}`, 'Successful');
      return { success: true, message: 'Employee offboarded successfully' };
    } catch (error: any) {
      await this.auditLogService.logAction('OFFBOARD_EMPLOYEE', `Failed to offboard employee: ${error.message}`, 'Failed');
      return { success: false, message: error.message };
    }
  }

  /** ✅ Delete Employee */
  async deleteEmployee(employeeId: string) {
    try {
      await this.firestore.collection(this.collectionName).doc(employeeId).delete();
      await this.auditLogService.logAction('DELETE_EMPLOYEE', `Employee deleted: ${employeeId}`, 'Successful');
      return { success: true, message: 'Employee deleted successfully' };
    } catch (error: any) {
      await this.auditLogService.logAction('DELETE_EMPLOYEE', `Failed to delete employee: ${error.message}`, 'Failed');
      return { success: false, message: error.message };
    }
  }
}
