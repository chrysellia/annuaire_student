import pandas as pd
import random
from faker import Faker
from classes.database import database_manager
from seeder_models import metadata

class SeederExt:
    def __init__(self, n_users=20, n_teachers=10, n_courses=15, n_students=100, n_enrollments=200):
        self.n_users = n_users
        self.n_teachers = n_teachers
        self.n_courses = n_courses
        self.n_students = n_students
        self.n_enrollments = n_enrollments
        self.faker = Faker()
        self.user_ids = []
        self.teacher_ids = []
        self.course_ids = []
        self.student_ids = []

    def create_all_tables(self):
        engine = database_manager.engine
        print("[SeederExt] Creating all tables if not exist...")
        metadata.create_all(engine)
        print("[SeederExt] All tables ensured.")

    def seed_users(self):
        print(f"[SeederExt] Generating {self.n_users} users...")
        users = []
        for i in range(self.n_users):
            username = self.faker.user_name()[:50]
            password = self.faker.password(length=20)[:255]
            email = f"user{i}_{self.faker.email()}"[:100]
            created_at = self.faker.date_time_between(start_date='-5y', end_date='now')
            updated_at = created_at
            users.append({
                'username': username,
                'password': password,
                'email': email,
                'created_at': created_at,
                'updated_at': updated_at
            })
        df = pd.DataFrame(users)
        database_manager.insert_df('users', df, if_exists='append')
        # Fetch user ids
        df_db = database_manager.select('users')
        self.user_ids = df_db['id'].tolist()
        print(f"[SeederExt] Inserted {len(self.user_ids)} users.")

    def seed_teachers(self):
        print(f"[SeederExt] Generating {self.n_teachers} teachers...")
        teachers = []
        for i in range(self.n_teachers):
            employee_id = f"EMP{1000+i:06d}"[:20]
            first_name = self.faker.first_name()[:50]
            last_name = self.faker.last_name()[:50]
            email = f"teacher{i}_{self.faker.email()}"[:100]
            phone = self.faker.phone_number()[:20]
            department = random.choice(['Math', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'CS'])[:100]
            hire_date = self.faker.date_between(start_date='-10y', end_date='today')
            created_at = self.faker.date_time_between(start_date='-10y', end_date='now')
            updated_at = created_at
            user_id = random.choice(self.user_ids) if self.user_ids else None
            teachers.append({
                'employee_id': employee_id,
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'phone': phone,
                'department': department,
                'hire_date': hire_date,
                'created_at': created_at,
                'updated_at': updated_at
            })
        df = pd.DataFrame(teachers)
        database_manager.insert_df('teachers', df, if_exists='append')
        df_db = database_manager.select('teachers')
        self.teacher_ids = df_db['id'].tolist()
        print(f"[SeederExt] Inserted {len(self.teacher_ids)} teachers.")

    def seed_courses(self):
        print(f"[SeederExt] Generating {self.n_courses} courses...")
        courses = []
        for i in range(self.n_courses):
            course_code = f"CSE{1000+i:06d}"[:20]
            course_name = random.choice(['Algebra', 'Physics', 'Chemistry', 'Biology', 'Programming', 'Mechanics', 'Databases', 'Networks', 'AI', 'Math'])[:100]
            description = self.faker.text(max_nb_chars=200)
            credits = random.choice([2, 3, 4, 5])
            department = random.choice(['Math', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'CS'])[:100]
            semester = random.choice(['Fall', 'Spring', 'Summer'])[:20]
            year = random.randint(2019, 2025)
            teacher_id = random.choice(self.teacher_ids) if self.teacher_ids else None
            max_students = random.randint(20, 120)
            is_active = True
            created_at = self.faker.date_time_between(start_date='-5y', end_date='now')
            updated_at = created_at
            courses.append({
                'course_code': course_code,
                'course_name': course_name,
                'description': description,
                'credits': credits,
                'department': department,
                'semester': semester,
                'year': year,
                'teacher_id': teacher_id,
                'max_students': max_students,
                'is_active': is_active,
                'created_at': created_at,
                'updated_at': updated_at
            })
        df = pd.DataFrame(courses)
        database_manager.insert_df('courses', df, if_exists='append')
        df_db = database_manager.select('courses')
        self.course_ids = df_db['id'].tolist()
        print(f"[SeederExt] Inserted {len(self.course_ids)} courses.")

    def seed_students(self):
        print(f"[SeederExt] Generating {self.n_students} students...")
        students = []
        for idx in range(self.n_students):
            student_number = f"STU{100000+idx:06d}"[:20]
            first_name = self.faker.first_name()[:50]
            last_name = self.faker.last_name()[:50]
            email = f"student{idx}_{self.faker.email()}"[:100]
            phone = self.faker.phone_number()[:20]
            date_of_birth = self.faker.date_of_birth(minimum_age=18, maximum_age=30)
            address = self.faker.address().replace('\n', ', ')
            enrollment_date = self.faker.date_between(start_date='-5y', end_date='today')
            graduation_date = None if random.random() < 0.5 else self.faker.date_between(start_date=enrollment_date, end_date='+4y')
            status = random.choice(['active', 'graduated', 'suspended', 'dropped'])
            program = random.choice(['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering'])[:100]
            year_level = random.randint(1, 5)
            gpa = round(random.uniform(2.0, 4.0), 2)
            user_id = random.choice(self.user_ids) if self.user_ids else None
            created_at = self.faker.date_time_between(start_date='-5y', end_date='now')
            updated_at = created_at
            students.append({
                'student_number': student_number,
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'phone': phone,
                'date_of_birth': date_of_birth,
                'address': address,
                'enrollment_date': enrollment_date,
                'graduation_date': graduation_date,
                'status': status,
                'program': program,
                'year_level': year_level,
                'gpa': gpa,
                'user_id': user_id,
                'created_at': created_at,
                'updated_at': updated_at
            })
        df = pd.DataFrame(students)
        database_manager.insert_df('students', df, if_exists='append')
        df_db = database_manager.select('students')
        self.student_ids = df_db['id'].tolist()
        print(f"[SeederExt] Inserted {len(self.student_ids)} students.")

    def seed_enrollments(self):
        print(f"[SeederExt] Generating {self.n_enrollments} enrollments...")
        enrollments = []
        for i in range(self.n_enrollments):
            student_id = random.choice(self.student_ids) if self.student_ids else None
            course_id = random.choice(self.course_ids) if self.course_ids else None
            enrollment_date = self.faker.date_between(start_date='-5y', end_date='today')
            grade = random.choice(['A', 'B', 'C', 'D', 'F', None])
            status = random.choice(['enrolled', 'completed', 'dropped', 'failed'])
            created_at = self.faker.date_time_between(start_date='-5y', end_date='now')
            updated_at = created_at
            enrollments.append({
                'student_id': student_id,
                'course_id': course_id,
                'enrollment_date': enrollment_date,
                'grade': grade,
                'status': status,
                'created_at': created_at,
                'updated_at': updated_at
            })
        df = pd.DataFrame(enrollments)
        # Remove duplicates on (student_id, course_id)
        df = df.drop_duplicates(subset=['student_id', 'course_id'])
        database_manager.insert_df('enrollments', df, if_exists='append')
        print(f"[SeederExt] Inserted {len(df)} enrollments.")

    def seed_migrations(self):
        print(f"[SeederExt] Generating 2 migrations...")
        migrations = [
            {'migration_name': 'init_schema', 'executed_at': self.faker.date_time_between(start_date='-5y', end_date='now')},
            {'migration_name': 'add_indexes', 'executed_at': self.faker.date_time_between(start_date='-3y', end_date='now')}
        ]
        df = pd.DataFrame(migrations)
        database_manager.insert_df('migrations', df, if_exists='append')
        print(f"[SeederExt] Inserted {len(migrations)} migrations.")

    def run_full_seed(self):
        self.create_all_tables()
        self.seed_users()
        self.seed_teachers()
        self.seed_courses()
        self.seed_students()
        self.seed_enrollments()
        self.seed_migrations()
        print("[SeederExt] All tables seeded.")
        return True
