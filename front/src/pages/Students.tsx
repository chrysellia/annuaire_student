import React, { useEffect, useState } from "react";
import axios from "../axios";
import type { Student } from "../types";
import Modal from '@mui/material/Modal';
import AddStudentForm from "../components/AddStudentForm";

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', status: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchStudents = () => {
    setLoading(true);
    axios.get<Student[]>("/students")
      .then((res: { data: Student[] }) => {
        setStudents(res.data);
        setError(null);
      })
      .catch((_: unknown) => {
        setError("Failed to load students.");
        setStudents([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Modal close on Escape
  useEffect(() => {
    if (!showModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showModal]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await axios.post<Student>("/students", {
        ...form,
        status: Number(form.status),
      });
      fetchStudents(); // Refetch students after adding
      setShowModal(false);
      setForm({ name: '', email: '', status: 1 });
    } catch (err) {
      setFormError("Failed to add student.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Students</h2>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setShowModal(true)}
        >
          + Add Student
        </button>
      </div>
      <p className="text-gray-800">Browse and manage all students. You can search, filter, and view student details.</p>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-gray-500 py-6">Loading students...</div>
        ) : error ? (
          <div className="text-red-600 py-6">{error}</div>
        ) : (
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {students && students.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="px-4 py-2">{student.first_name + " " + student.last_name}</td>
                  <td className="px-4 py-2">{student.email}</td>
                  <td className={
                    "px-4 py-2 " +
                    (student.status === "active"
                      ? "text-green-700"
                      : student.status === "inactive"
                        ? "text-yellow-700"
                        : "text-red-700")
                  }>
                    {student.status === "active" ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="add-student-title"
        aria-describedby="add-student-description"
      >
        <AddStudentForm
          form={form}
          formError={formError}
          submitting={submitting}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Students;
