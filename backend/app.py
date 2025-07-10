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
        return jsonify(students.to_dict(orient='records'))
    except Exception as e:
        from flask import current_app
        current_app.logger.exception("Error in /students")
        return jsonify({'error': str(e)}), 500

@app.route('/students', methods=['POST'])
def add_student():
    data = request.json
    database_manager.insert_df('students', pd.DataFrame([data]), if_exists='append')
    return jsonify({'status': 'success'}), 201

if __name__ == '__main__':
    # Enable debug mode only if FLASK_ENV is 'development'
    debug_mode = os.environ.get('FLASK_ENV', '').lower() == 'development'
    app.run(host='0.0.0.0', port=9090, debug=True)
