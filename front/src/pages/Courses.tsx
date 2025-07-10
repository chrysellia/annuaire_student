import React from "react";

const Courses: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-blue-900">Courses</h2>
    <p className="text-gray-800">Manage all courses. Add new courses, edit existing ones, and assign instructors.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold text-blue-700">Mathematics</h3>
        <p>Instructor: Prof. John</p>
        <p>Enrolled: 40 students</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold text-blue-700">Physics</h3>
        <p>Instructor: Dr. Smith</p>
        <p>Enrolled: 32 students</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold text-blue-700">Chemistry</h3>
        <p>Instructor: Dr. Lee</p>
        <p>Enrolled: 28 students</p>
      </div>
    </div>
  </div>
);

export default Courses;
