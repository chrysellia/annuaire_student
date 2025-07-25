from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from classes.database import database_manager
import os
import pandas as pd
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from werkzeug.security import check_password_hash
# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# JWT configuration
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-key')
jwt = JWTManager(app)


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'msg': 'Missing username or password'}), 400

    # Query user from DB
    users = database_manager.select('users', where_clause=f"username = '{username}'")
    if users.empty:
        return jsonify({'msg': 'User not found'}), 400
    user = users.iloc[0]
    # For demo: Accept plain password or hashed password (if hash present)
    db_password = user['password'] if 'password' in user else user.get('password_hash')
    if not db_password:
        return jsonify({'msg': 'User password not set'}), 400
    # Accept either plain or hashed (for legacy)
    if db_password == password or check_password_hash(db_password, password):
        # Ensure id is a native int for JWT
        user_id = user['id']
        try:
            import numpy as np
            if isinstance(user_id, np.integer):
                user_id = int(user_id)
        except ImportError:
            pass
        # Flask-JWT-Extended expects identity to be a string or int, not a dict
        token = create_access_token(identity=str(user_id))
        # Convert user row to dict and cast all values to native Python types
        user_dict = user.to_dict()
        for k, v in user_dict.items():
            try:
                # Convert numpy types to native Python
                import numpy as np
                if isinstance(v, (np.integer, np.floating)):
                    user_dict[k] = v.item()
                elif isinstance(v, np.ndarray):
                    user_dict[k] = v.tolist()
            except ImportError:
                pass
        return jsonify(token=token, user=user_dict), 200
    else:
        return jsonify({'msg': 'Bad credentials'}), 401

@app.route('/students', methods=['GET'])
@jwt_required()
def get_students():
    try:
        students = database_manager.select('students')
        
        # Convert DataFrame to dict and handle date serialization
        students_dict = students.to_dict(orient='records')
        
        # Convert date objects to strings for JSON serialization
        for student in students_dict:
            for key, value in student.items():
                if hasattr(value, 'strftime'):  # Check if it's a date/datetime object
                    student[key] = value.strftime('%Y-%m-%d') if hasattr(value, 'date') else value.strftime('%Y-%m-%d')
                elif pd.isna(value):  # Handle NaN values
                    student[key] = None
        
        response = jsonify(students_dict)
        response.headers['Content-Type'] = 'application/json'
        return response
    except Exception as e:
        from flask import current_app
        current_app.logger.exception("Error in /students")
        error_response = jsonify({'error': str(e)})
        error_response.headers['Content-Type'] = 'application/json'
        return error_response, 500

def generate_student_number():
    """Generate a new student number in the format STU + 6 digits"""
    # Get the highest current student number
    try:
        students = database_manager.select('students', columns=['student_number'])
        if not students.empty and 'student_number' in students.columns:
            # Extract the numeric part of existing student numbers and find the max
            max_num = students['student_number'].str.extract(r'(\d+)').astype(float).max().item()
            next_num = int(max_num) + 1 if not pd.isna(max_num) else 1
        else:
            next_num = 1
    except Exception as e:
        current_app.logger.error(f"Error generating student number: {e}")
        next_num = 1  # Fallback to 1 if there's any error
    
    return f"STU{next_num:06d}"

@app.route('/students', methods=['POST'])
@jwt_required()
def add_student():
    try:
        data = request.json
        
        # Generate a new student number
        if 'student_number' not in data or not data['student_number']:
            data['student_number'] = generate_student_number()
        
        # Insert the new student
        database_manager.insert_df('students', pd.DataFrame([data]), if_exists='append')
        
        # Return the created student data including the generated student number
        return jsonify({
            'status': 'success', 
            'student_number': data['student_number']
        }), 201
    except Exception as e:
        current_app.logger.exception("Error adding student")
        return jsonify({'error': str(e)}), 500

@app.route('/students/<int:student_id>', methods=['PUT'])
@jwt_required()
def update_student(student_id):
    try:
        data = request.json
        # Convert the data dictionary to a DataFrame with a single row
        # update_df = pd.DataFrame([])
        
        # Update the student record in the database
        database_manager.update(
            table_name='students',
            where_clause=f'id = {student_id}',
            values={**data}
        )
        
        return jsonify({'status': 'success', 'message': 'Student updated successfully'}), 200
    except Exception as e:
        current_app.logger.exception(f"Error updating student {student_id}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Enable debug mode only if FLASK_ENV is 'development'
    debug_mode = os.environ.get('FLASK_ENV', '').lower() == 'development'
    app.run(host='0.0.0.0', port=5000, debug=True)
