import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import Table from '../components/common/Table';
import Loader from '../components/common/Loader';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { IoAdd, IoTrashOutline, IoPencilOutline } from 'react-icons/io5';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    department: 'Engineering',
    designation: '',
    joinedDate: ''
  });

  const [error, setError] = useState('');

  const fetchEmployees = async () => {
    try {
      const data = await employeeAPI.getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedEmployee(null);
    setFormData({
      name: '',
      employeeId: '',
      email: '',
      department: 'Engineering',
      designation: '',
      joinedDate: new Date().toISOString().split('T')[0]
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (emp) => {
    setSelectedEmployee(emp);
    setFormData({
      name: emp.name,
      employeeId: emp.employeeId,
      email: emp.email,
      department: emp.department,
      designation: emp.designation,
      joinedDate: emp.joinedDate
    });
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        setLoading(true);
        await employeeAPI.deleteEmployee(id);
        await fetchEmployees();
      } catch (error) {
        alert(error.message || 'Failed to delete employee');
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (selectedEmployee) {
        // Edit mode
        await employeeAPI.updateEmployee(selectedEmployee.id, formData);
      } else {
        // Add mode
        await employeeAPI.addEmployee(formData);
      }
      setModalOpen(false);
      await fetchEmployees();
    } catch (err) {
      setError(err.message || 'Action failed');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading && employees.length === 0) {
    return <Loader />;
  }

  const headers = ['Name', 'Employee ID', 'Email', 'Department', 'Designation', 'Joined Date', 'Actions'];
  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'Human Resources', 'Finance'];

  const renderRow = (emp, index) => (
    <tr key={emp.id || index}>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={emp.profilePhoto}
            alt={emp.name}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <span style={{ fontWeight: 600 }}>{emp.name}</span>
        </div>
      </td>
      <td>{emp.employeeId}</td>
      <td>{emp.email}</td>
      <td>{emp.department}</td>
      <td>{emp.designation}</td>
      <td>{emp.joinedDate}</td>
      <td>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => handleOpenEditModal(emp)}
            style={{ background: 'none', border: 'none', color: 'var(--info-text)', cursor: 'pointer', display: 'flex', padding: '0.25rem', borderRadius: '4px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(14, 165, 233, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <IoPencilOutline size={18} />
          </button>
          <button
            onClick={() => handleDelete(emp.id)}
            style={{ background: 'none', border: 'none', color: 'var(--danger-text)', cursor: 'pointer', display: 'flex', padding: '0.25rem', borderRadius: '4px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <IoTrashOutline size={18} />
          </button>
        </div>
      </td>
    </tr>
  );

  const tableActions = (
    <Button variant="primary" onClick={handleOpenAddModal} style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}>
      <IoAdd size={16} />
      <span>Add Employee</span>
    </Button>
  );

  return (
    <div style={{ flexGrow: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage company staff records and profiles</p>
        </div>
      </div>

      <Card hoverable={false}>
        <Table
          headers={headers}
          data={employees}
          renderRow={renderRow}
          searchPlaceholder="Search employees..."
          searchField="name"
          actions={tableActions}
        />
      </Card>

      {/* Add / Edit Employee Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedEmployee ? 'Edit Employee Details' : 'Add New Employee'}
      >
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-glow)', borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--danger-text)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Employee ID"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
            />

            <div className="glass-input-group">
              <label htmlFor="modal-department" className="glass-input-label">Department *</label>
              <select
                id="modal-department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="glass-input"
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-primary)', cursor: 'pointer' }}
                required
              >
                {departments.map((dept, idx) => (
                  <option key={idx} value={dept} style={{ background: '#1e1b4b', color: '#fff' }}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Designation"
              name="designation"
              placeholder="e.g. Developer"
              value={formData.designation}
              onChange={handleChange}
              required
            />

            <Input
              label="Joined Date"
              type="date"
              name="joinedDate"
              value={formData.joinedDate}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
            <Button type="submit">
              {selectedEmployee ? 'Save Changes' : 'Create Account'}
            </Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
