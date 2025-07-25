from sqlalchemy import Table, Column, Integer, String, Text, Date, DateTime, Enum, ForeignKey, Numeric, Boolean, TIMESTAMP, MetaData

metadata = MetaData()

users = Table(
    'users', metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('username', String(50), unique=True, nullable=False),
    Column('password', String(255), nullable=False),
    Column('email', String(100), unique=True, nullable=False),
    Column('created_at', TIMESTAMP, nullable=True),
    Column('updated_at', TIMESTAMP, nullable=True)
)

students = Table(
    'students', metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('student_number', String(20), unique=True, nullable=False),
    Column('first_name', String(50), nullable=False),
    Column('last_name', String(50), nullable=False),
    Column('email', String(100), unique=True),
    Column('phone', String(20)),
    Column('date_of_birth', Date),
    Column('address', Text),
    Column('enrollment_date', Date),
    Column('graduation_date', Date),
    Column('status', Enum('active','graduated','suspended','dropped', name='student_status'), default='active'),
    Column('program', String(100)),
    Column('year_level', Integer, default=1),
    Column('gpa', Numeric(3,2)),
    Column('user_id', Integer, ForeignKey('users.id', ondelete='SET NULL')),
    Column('created_at', TIMESTAMP, nullable=True),
    Column('updated_at', TIMESTAMP, nullable=True)
)

teachers = Table(
    'teachers', metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('employee_id', String(20), unique=True, nullable=False),
    Column('first_name', String(50), nullable=False),
    Column('last_name', String(50), nullable=False),
    Column('email', String(100), unique=True),
    Column('phone', String(20)),
    Column('department', String(100)),
    Column('hire_date', Date),
    Column('created_at', TIMESTAMP, nullable=True),
    Column('updated_at', TIMESTAMP, nullable=True)
)

courses = Table(
    'courses', metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('course_code', String(20), unique=True, nullable=False),
    Column('course_name', String(100), nullable=False),
    Column('description', Text),
    Column('credits', Integer, default=3),
    Column('department', String(100)),
    Column('semester', String(20)),
    Column('year', Integer),
    Column('teacher_id', Integer, ForeignKey('teachers.id', ondelete='SET NULL')),
    Column('max_students', Integer, default=30),
    Column('is_active', Boolean, default=True),
    Column('created_at', TIMESTAMP, nullable=True),
    Column('updated_at', TIMESTAMP, nullable=True)
)

enrollments = Table(
    'enrollments', metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('student_id', Integer, ForeignKey('students.id', ondelete='CASCADE'), nullable=False),
    Column('course_id', Integer, ForeignKey('courses.id', ondelete='CASCADE'), nullable=False),
    Column('enrollment_date', Date),
    Column('grade', String(5)),
    Column('status', Enum('enrolled','completed','dropped','failed', name='enrollment_status'), default='enrolled'),
    Column('created_at', TIMESTAMP, nullable=True),
    Column('updated_at', TIMESTAMP, nullable=True),
    # Unique constraint on (student_id, course_id) is handled by SQLAlchemy automatically for unique_together
)

migrations = Table(
    'migrations', metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('migration_name', String(255), nullable=False),
    Column('executed_at', TIMESTAMP, nullable=True)
)
