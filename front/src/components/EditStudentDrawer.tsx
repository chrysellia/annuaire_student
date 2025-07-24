import React from "react";
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { Student } from "../types";

interface EditStudentDrawerProps {
  open: boolean;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  form: Partial<Student>;
  formError: string | null;
}

const EditStudentDrawer: React.FC<EditStudentDrawerProps> = ({
  open,
  onClose,
  onChange,
  onSubmit,
  submitting,
  form,
  formError
}) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Edit Student
        </Typography>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-900">First Name</label>
            <input
              type="text"
              name="first_name"
              value={form.first_name || ''}
              onChange={onChange}
              className="mt-1 block w-full border border-blue-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-900">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name || ''}
              onChange={onChange}
              className="mt-1 block w-full border border-blue-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-900">Email</label>
            <input
              type="email"
              name="email"
              value={form.email || ''}
              onChange={onChange}
              className="mt-1 block w-full border border-blue-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-900">Status</label>
            <select
              name="status"
              value={form.status || ''}
              onChange={onChange}
              className="mt-1 block w-full border border-blue-300 rounded px-3 py-2"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          {/* Add more fields as needed */}
          {formError && <div style={{ color: '#d32f2f' }}>{formError}</div>}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
            <Button variant="outlined" color="primary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default EditStudentDrawer;
