export interface Student {
  id: string;
  name: string;
  studentId: string;
}

export interface Question {
  id: string;
  content: string;
  studentName: string;
  studentId: string;
  category?: string;
  timestamp: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
} 