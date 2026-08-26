import axios from 'axios';

// Initialize Axios client
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('elms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag to use mock data instead of calling live backend.
// By default, since this is a frontend-only project, we use mock storage for interactive testing.
const USE_MOCK = false;

// Mock Data Initializer
const initMockDatabase = () => {
  if (!localStorage.getItem('elms_users')) {
    const defaultUsers = [
      {
        id: '1',
        name: 'Jane Doe',
        email: 'employee@elms.com',
        password: 'password',
        employeeId: 'EMP101',
        department: 'Engineering',
        role: 'employee',
        profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        joinedDate: '2024-01-15',
        designation: 'Senior Frontend Engineer',
        leaveBalance: { sick: 5, casual: 6, annual: 12, other: 10 }
      },
      {
        id: '2',
        name: 'John Smith',
        email: 'john@elms.com',
        password: 'password',
        employeeId: 'EMP102',
        department: 'Design',
        role: 'employee',
        profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        joinedDate: '2024-03-10',
        designation: 'UI/UX Designer',
        leaveBalance: { sick: 6, casual: 8, annual: 15, other: 10 }
      },
      {
        id: '3',
        name: 'Admin Moderator',
        email: 'admin@elms.com',
        password: 'password',
        employeeId: 'ADM001',
        department: 'Human Resources',
        role: 'admin',
        profilePhoto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
        joinedDate: '2023-05-20',
        designation: 'HR Lead',
        leaveBalance: { sick: 8, casual: 8, annual: 20, other: 10 }
      }
    ];
    localStorage.setItem('elms_users', JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem('elms_leaves')) {
    const defaultLeaves = [
      {
        id: 'l1',
        userId: '1',
        employeeName: 'Jane Doe',
        employeeId: 'EMP101',
        department: 'Engineering',
        leaveType: 'Annual Leave',
        startDate: '2026-07-20',
        endDate: '2026-07-25',
        reason: 'Family vacation trip',
        status: 'pending',
        appliedDate: '2026-07-14'
      },
      {
        id: 'l2',
        userId: '2',
        employeeName: 'John Smith',
        employeeId: 'EMP102',
        department: 'Design',
        leaveType: 'Sick Leave',
        startDate: '2026-07-05',
        endDate: '2026-07-07',
        reason: 'Flu symptoms and medical checkup',
        status: 'approved',
        appliedDate: '2026-07-04',
        approvedBy: 'Admin Moderator'
      },
      {
        id: 'l3',
        userId: '1',
        employeeName: 'Jane Doe',
        employeeId: 'EMP101',
        department: 'Engineering',
        leaveType: 'Casual Leave',
        startDate: '2026-06-15',
        endDate: '2026-06-16',
        reason: 'Personal urgent work',
        status: 'approved',
        appliedDate: '2026-06-12',
        approvedBy: 'Admin Moderator'
      },
      {
        id: 'l4',
        userId: '2',
        employeeName: 'John Smith',
        employeeId: 'EMP102',
        department: 'Design',
        leaveType: 'Annual Leave',
        startDate: '2026-05-10',
        endDate: '2026-05-15',
        reason: 'Attending friend\'s wedding',
        status: 'rejected',
        appliedDate: '2026-05-01',
        approvedBy: 'Admin Moderator',
        rejectionReason: 'Overlap with critical project launch timelines'
      }
    ];
    localStorage.setItem('elms_leaves', JSON.stringify(defaultLeaves));
  }
};

// Initialize Mock Database
initMockDatabase();

// Mock Helper functions
const getMockUsers = () => JSON.parse(localStorage.getItem('elms_users'));
const saveMockUsers = (users) => localStorage.setItem('elms_users', JSON.stringify(users));
const getMockLeaves = () => JSON.parse(localStorage.getItem('elms_leaves'));
const saveMockLeaves = (leaves) => localStorage.setItem('elms_leaves', JSON.stringify(leaves));

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  login: async (email, password) => {
    if (USE_MOCK) {
      await delay();
      const users = getMockUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!user) {
        throw new Error('Invalid email or password');
      }
      const token = `mock-token-${user.id}`;
      localStorage.setItem('elms_token', token);
      localStorage.setItem('elms_user_id', user.id);
      return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, employeeId: user.employeeId, department: user.department } };
    }
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    if (USE_MOCK) {
      await delay();
      const users = getMockUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (existingUser) {
        throw new Error('Email is already registered');
      }
      const newUser = {
        id: String(users.length + 1),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        employeeId: userData.employeeId,
        department: userData.department,
        role: 'employee',
        profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', // placeholder
        joinedDate: new Date().toISOString().split('T')[0],
        designation: 'Software Associate',
        leaveBalance: { sick: 10, casual: 10, annual: 15, other: 10 }
      };
      users.push(newUser);
      saveMockUsers(users);
      return { success: true, message: 'Registration successful' };
    }
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    if (USE_MOCK) {
      await delay(200);
      const userId = localStorage.getItem('elms_user_id');
      if (!userId) throw new Error('Not authenticated');
      const users = getMockUsers();
      const user = users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');
      return { user };
    }
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  }
};

export const leaveAPI = {
  getLeaves: async (userId = null) => {
    if (USE_MOCK) {
      await delay();
      const leaves = getMockLeaves();
      if (userId) {
        return leaves.filter(l => l.userId === userId);
      }
      return leaves;
    }
    const url = userId ? `/leaves?userId=${userId}` : '/leaves';
    const response = await axiosInstance.get(url);
    return response.data;
  },

  applyLeave: async (leaveData) => {
    if (USE_MOCK) {
      await delay();
      const leaves = getMockLeaves();
      const users = getMockUsers();
      const userId = localStorage.getItem('elms_user_id');
      const user = users.find(u => u.id === userId);

      if (!user) throw new Error('User profile mismatch');

      // Calculate number of days
      const start = new Date(leaveData.startDate);
      const end = new Date(leaveData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Check balance mapping
      const typeKey = leaveData.leaveType.toLowerCase().split(' ')[0]; // 'sick', 'casual', 'annual', 'other'
      const key = user.leaveBalance[typeKey] !== undefined ? typeKey : 'other';

      if (user.leaveBalance[key] < diffDays) {
        throw new Error(`Insufficient leave balance for ${leaveData.leaveType}. Required: ${diffDays}, Available: ${user.leaveBalance[key]}`);
      }

      const newLeave = {
        id: `l${leaves.length + 1}`,
        userId: user.id,
        employeeName: user.name,
        employeeId: user.employeeId,
        department: user.department,
        leaveType: leaveData.leaveType,
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        reason: leaveData.reason,
        status: 'pending',
        appliedDate: new Date().toISOString().split('T')[0]
      };

      leaves.push(newLeave);
      saveMockLeaves(leaves);
      return newLeave;
    }
    const response = await axiosInstance.post('/leaves', leaveData);
    return response.data;
  },

  updateStatus: async (leaveId, status, rejectionReason = '') => {
    if (USE_MOCK) {
      await delay();
      const leaves = getMockLeaves();
      const users = getMockUsers();
      const adminId = localStorage.getItem('elms_user_id');
      const admin = users.find(u => u.id === adminId);

      const leaveIndex = leaves.findIndex(l => l.id === leaveId);
      if (leaveIndex === -1) throw new Error('Leave request not found');

      const leave = leaves[leaveIndex];
      leave.status = status;
      leave.approvedBy = admin ? admin.name : 'System Admin';
      if (status === 'rejected') {
        leave.rejectionReason = rejectionReason;
      }

      // If approved, deduct leave balance
      if (status === 'approved') {
        const user = users.find(u => u.id === leave.userId);
        if (user) {
          const start = new Date(leave.startDate);
          const end = new Date(leave.endDate);
          const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
          const typeKey = leave.leaveType.toLowerCase().split(' ')[0];
          const key = user.leaveBalance[typeKey] !== undefined ? typeKey : 'other';
          user.leaveBalance[key] = Math.max(0, user.leaveBalance[key] - diffDays);
          saveMockUsers(users);
        }
      }

      leaves[leaveIndex] = leave;
      saveMockLeaves(leaves);
      return leave;
    }
    const response = await axiosInstance.patch(`/leaves/${leaveId}`, { status, rejectionReason });
    return response.data;
  }
};

export const employeeAPI = {
  getEmployees: async () => {
    if (USE_MOCK) {
      await delay();
      const users = getMockUsers();
      return users.filter(u => u.role === 'employee');
    }
    const response = await axiosInstance.get('/employees');
    return response.data;
  },

  addEmployee: async (employeeData) => {
    if (USE_MOCK) {
      await delay();
      const users = getMockUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === employeeData.email.toLowerCase());
      if (existingUser) {
        throw new Error('Email is already in use');
      }
      const newEmp = {
        id: String(users.length + 1),
        name: employeeData.name,
        email: employeeData.email,
        password: 'password123', // default
        employeeId: employeeData.employeeId,
        department: employeeData.department,
        role: 'employee',
        profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        joinedDate: employeeData.joinedDate || new Date().toISOString().split('T')[0],
        designation: employeeData.designation || 'Software Associate',
        leaveBalance: { sick: 10, casual: 10, annual: 15, other: 10 }
      };
      users.push(newEmp);
      saveMockUsers(users);
      return newEmp;
    }
    const response = await axiosInstance.post('/employees', employeeData);
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    if (USE_MOCK) {
      await delay();
      const users = getMockUsers();
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex === -1) throw new Error('Employee not found');
      
      users[userIndex] = {
        ...users[userIndex],
        ...employeeData
      };
      saveMockUsers(users);
      return users[userIndex];
    }
    const response = await axiosInstance.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id) => {
    if (USE_MOCK) {
      await delay();
      let users = getMockUsers();
      users = users.filter(u => u.id !== id);
      saveMockUsers(users);
      return { success: true };
    }
    const response = await axiosInstance.delete(`/employees/${id}`);
    return response.data;
  }
};

export const reportAPI = {
  getReportData: async () => {
    if (USE_MOCK) {
      await delay();
      const leaves = getMockLeaves();
      const users = getMockUsers();
      const employees = users.filter(u => u.role === 'employee');

      // Aggregate monthly leaves
      // We will group approved leaves by month
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyCount = Array(12).fill(0);
      
      leaves.forEach(l => {
        if (l.status === 'approved') {
          const date = new Date(l.startDate);
          const monthIdx = date.getMonth();
          if (!isNaN(monthIdx)) {
            monthlyCount[monthIdx]++;
          }
        }
      });

      const chartData = months.map((month, idx) => ({
        label: month,
        value: monthlyCount[idx]
      }));

      // Department summaries
      const departmentSummary = {};
      employees.forEach(emp => {
        if (!departmentSummary[emp.department]) {
          departmentSummary[emp.department] = { total: 0, approvedLeaves: 0 };
        }
        departmentSummary[emp.department].total++;
      });

      leaves.forEach(l => {
        if (l.status === 'approved' && departmentSummary[l.department]) {
          departmentSummary[l.department].approvedLeaves++;
        }
      });

      const departmentData = Object.keys(departmentSummary).map(dept => ({
        departmentName: dept,
        employeeCount: departmentSummary[dept].total,
        approvedLeavesCount: departmentSummary[dept].approvedLeaves
      }));

      return {
        monthlyChart: chartData,
        departments: departmentData,
        totals: {
          totalEmployees: employees.length,
          totalRequests: leaves.length,
          pendingRequests: leaves.filter(l => l.status === 'pending').length,
          approvedRequests: leaves.filter(l => l.status === 'approved').length,
          rejectedRequests: leaves.filter(l => l.status === 'rejected').length
        }
      };
    }
    const response = await axiosInstance.get('/reports');
    return response.data;
  }
};
