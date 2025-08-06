import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface AddStudentFormProps {
  form: {
    first_name: string;
    last_name: string;
    email: string;
    status: string;
  };
  formError: string | null;
  submitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const AddStudentForm: React.FC<AddStudentFormProps> = ({
  form,
  formError,
  submitting,
  onChange,
  onSubmit,
  onCancel
}) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #1976d2',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}
    >
      <Typography id="add-student-title" variant="h6" component="h2" sx={{ mb: 1 }}>
        Add a new student
      </Typography>
      <Typography id="add-student-description" sx={{ mb: 2 }}>
        Fill out the form to add a new student.
      </Typography>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: 4, color: '#1565c0' }}>First Name</label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={onChange}
            required
            style={{ width: '100%', border: '1px solid #90caf9', borderRadius: 4, padding: 8 }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: 4, color: '#1565c0' }}>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={onChange}
            required
            style={{ width: '100%', border: '1px solid #90caf9', borderRadius: 4, padding: 8 }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: 4, color: '#1565c0' }}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            style={{ width: '100%', border: '1px solid #90caf9', borderRadius: 4, padding: 8 }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: 4, color: '#1565c0' }}>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={onChange}
            style={{ width: '100%', border: '1px solid #90caf9', borderRadius: 4, padding: 8 }}
          >
            <option value="active">Active</option>
            <option value="graduated">Diplomé</option>
            <option value="suspended">Suspendu</option>
            <option value="dropped">Abandonné</option>
          </select>
        </div>
        {formError && <div style={{ color: '#d32f2f' }}>{formError}</div>}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
          <Button variant="outlined" color="primary" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Student'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddStudentForm;
