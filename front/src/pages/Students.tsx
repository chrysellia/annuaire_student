import React, { useEffect, useState } from "react";
import axios from "../axios";
import type { Student } from "../types";
import Modal from '@mui/material/Modal';
import AddStudentForm from "../components/AddStudentForm";
import EditStudentDrawer from "../components/EditStudentDrawer";

const Students: React.FC = () => {
  // Main state
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', status: 'active' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  // Edit drawer state
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Student>>({});
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const openEditDrawer = (student: Student) => {
    setSelectedStudent(student);
    setEditForm({ ...student });
    setEditFormError(null);
    setEditDrawerOpen(true);
  };
  const closeEditDrawer = () => {
    setEditDrawerOpen(false);
    setSelectedStudent(null);
    setEditForm({});
    setEditFormError(null);
  };
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setEditSubmitting(true);
    setEditFormError(null);
    try {
      await axios.put(`/students/${selectedStudent.id}`, editForm);
      fetchStudents();
      closeEditDrawer();
    } catch (err) {
      setEditFormError("Failed to update student.");
    } finally {
      setEditSubmitting(false);
    }
  };


  const fetchStudents = (pageParam = page, pageSizeParam = pageSize) => {
    setLoading(true);
    axios.get(`/students`, {
      params: { page: pageParam, page_size: pageSizeParam }
    })
      .then((res) => {
        setStudents(res.data.students);
        setTotal(res.data.total);
        setPage(res.data.page);
        setPageSize(res.data.page_size);
        setTotalPages(res.data.total_pages);
        setError(null);
      })
      .catch((_: unknown) => {
        setError("Failed to load students.");
        setStudents([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

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
    console.log("Form change:", e.target.name, e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await axios.post<Student>("/students", {
        ...form
      });
      fetchStudents(); // Refetch students after adding
      setShowModal(false);
      setForm({ first_name: '', last_name: '', email: '', status: 'active' });
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
          <>
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Last Name</th>
                  <th className="px-4 py-2 text-left">First Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students && students.map((student) => (
                  <tr key={student.id} className="border-t">
                    <td className="px-4 py-2">{student.last_name}</td>
                    <td className="px-4 py-2">{student.first_name}</td>
                    <td className="px-4 py-2">{student.email}</td>
                    <td className={
                      "px-4 py-2 " +
                      (student.status === "active"
                        ? "text-green-700"
                        : student.status === "inactive"
                          ? "text-yellow-700"
                          : "text-red-700")
                    }>
                      {String(student.status).charAt(0).toUpperCase() + String(student.status).slice(1)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={() => openEditDrawer(student)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4">
              <div>
                Page {page} of {totalPages} (Total: {total})
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-60"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <button
                  className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-60"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
                <select
                  className="ml-2 px-2 py-1 border rounded"
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {[5, 10, 20, 50].map(size => (
                    <option key={size} value={size}>{size} / page</option>
                  ))}
                </select>
              </div>
            </div>
          </>
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
      <EditStudentDrawer
        open={editDrawerOpen}
        onClose={closeEditDrawer}
        onChange={handleEditFormChange}
        onSubmit={handleEditFormSubmit}
        submitting={editSubmitting}
        form={editForm}
        formError={editFormError}
      />
    </div>
  );
};

export default Students;
