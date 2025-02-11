export interface OffboardData {
    id?: string;
    name: string;
    effectiveDate: string;
    personalEmail: string;
    exitInterview: string;
    automatedNotification: string;
    clearanceFileUrl: string;
    certificationFileUrl: string;
    timestamp: Date;
    status: 'pending' | 'completed';
  }
  