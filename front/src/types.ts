// Sample
/**{
  "address": "456 Avenue des Champs, Lyon",
  "created_at": "2025-07-20",
  "date_of_birth": "2001-12-03",
  "email": "pierre.durand@student.annuaire.edu",
  "enrollment_date": "2024-09-01",
  "first_name": "Pierre",
  "gpa": "3.80",
  "graduation_date": null,
  "id": 2,
  "last_name": "Durand",
  "phone": "+33123456792",
  "program": "Mathématiques",
  "status": "active",
  "student_number": "S2024002",
  "updated_at": "2025-07-20",
  "user_id": null,
  "year_level": 2
} */

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  student_number: string;
  year_level: number;
  address: string;
  phone: string;
  program: string;
  gpa: string;
  enrollment_date: string;
  graduation_date: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}


