from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from classes.database import database_manager
import os
import pandas as pd
# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route('/students', methods=['GET'])
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

@app.route('/students', methods=['POST'])
def add_student():
    data = request.json
    database_manager.insert_df('students', pd.DataFrame([data]), if_exists='append')
    return jsonify({'status': 'success'}), 201

if __name__ == '__main__':
    # Enable debug mode only if FLASK_ENV is 'development'
    debug_mode = os.environ.get('FLASK_ENV', '').lower() == 'development'
    app.run(host='0.0.0.0', port=5000, debug=True)
