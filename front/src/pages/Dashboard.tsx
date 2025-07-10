import React from "react";

const Dashboard: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-blue-900">Dashboard</h2>
    <p className="text-gray-800">Welcome to your dashboard! Here you can find a quick overview of student statistics and recent activity.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-lg font-semibold">Total Students</div>
        <div className="text-3xl text-blue-700 font-bold">128</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-lg font-semibold">Active Courses</div>
        <div className="text-3xl text-blue-700 font-bold">12</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-lg font-semibold">Pending Requests</div>
        <div className="text-3xl text-blue-700 font-bold">3</div>
      </div>
    </div>
    <div className="bg-blue-50 p-4 rounded shadow">
      <h3 className="font-semibold text-blue-700">Recent Activity</h3>
      <ul className="list-disc pl-5 text-gray-600">
        <li>New student <span className="font-medium">Alice Smith</span> enrolled in <span className="font-medium">Mathematics</span>.</li>
        <li>Course <span className="font-medium">Physics</span> updated by <span className="font-medium">Prof. John</span>.</li>
        <li>Student <span className="font-medium">Bob Lee</span> requested transcript.</li>
      </ul>
    </div>
  </div>
);

export default Dashboard;
