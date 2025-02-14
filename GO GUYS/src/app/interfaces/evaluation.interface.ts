export interface EvaluationCriteria {
  description: string;
  rating: number;
  points: number;
  category: string;
}

export interface Evaluation {
  employeeId: string;
  employeeName: string;
  date: Date;
  criteria: EvaluationCriteria[];
  totalPoints: number;
}
