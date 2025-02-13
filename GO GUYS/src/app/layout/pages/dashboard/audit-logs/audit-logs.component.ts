import { Component, OnInit } from '@angular/core';
import { AuditLogService } from '../../../../services/audit-log.service';

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss']
})
export class AuditLogsComponent implements OnInit {
  logs: any[] = [];

  constructor(private auditLogService: AuditLogService) {}

  ngOnInit() {
    // 🔹 Fetch logs from Firestore in real-time
    this.auditLogService.getAuditLogs().subscribe(data => {
      this.logs = data;
    });
  }
}
