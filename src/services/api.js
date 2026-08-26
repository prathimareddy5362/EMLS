import axios from 'axios';

// Backend URL
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token automatically for backend requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('elms_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// IMPORTANT:
// true = frontend mock/localStorage mode
// false = real backend mode
const USE_MOCK = true;

// ==============================
// MOCK DATABASE INITIALIZATION
// ==============================

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
        profilePhoto:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        joinedDate: '2024-01-15',
        designation: 'Senior Frontend Engineer',
        leaveBalance: {
          sick: 5,
          casual: 6,
          annual: 12,
          other: 10,
        },
      },
      {
        id: '2',
        name: 'John Smith',
        email: 'john@elms.com',
        password: 'password',
        employeeId: 'EMP102',
        department: 'Design',
        role: 'employee',
        profilePhoto:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        joinedDate: '2024-03-10',
        designation: 'UI/UX Designer',
        leaveBalance: {
          sick: 6,
          casual: 8,
          annual: 15,
          other: 10,
        },
      },
      {
        id: '3',
        name: 'Admin Moderator',
        email: 'admin@elms.com',
        password: 'password',
        employeeId: 'ADM001',
        department: 'Human Resources',
        role: 'admin',
        profilePhoto:
          'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
        joinedDate: '2023-05-20',
        designation: 'HR Lead',
        leaveBalance: {
          sick: 8,
          casual: 8,
          annual: 20,
          other: 10,
        },
      },
    ];

    localStorage.setItem(
      'elms_users',
      JSON.stringify(defaultUsers)
    );
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
        appliedDate: '2026-07-14',
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
        approvedBy: 'Admin Moderator',
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
        approvedBy: 'Admin Moderator',
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
        reason: "Attending friend's wedding",
        status: 'rejected',
        appliedDate: '2026-05-01',
        approvedBy: 'Admin Moderator',
        rejectionReason:
          'Overlap with critical project launch timelines',
      },
    ];

    localStorage.setItem(
      'elms_leaves',
      JSON.stringify(defaultLeaves)
    );
  }
};

// Initialize mock DB
initMockDatabase();

// ==============================
// HELPER FUNCTIONS
// ==============================

const getMockUsers = () => {
  return JSON.parse(
    localStorage.getItem('elms_users') || '[]'
  );
};

const saveMockUsers = (users) => {
  localStorage.setItem(
    'elms_users',
    JSON.stringify(users)
  );
};

const getMockLeaves = () => {
  return JSON.parse(
    localStorage.getItem('elms_leaves') || '[]'
  );
};

const saveMockLeaves = (leaves) => {
  localStorage.setItem(
    'elms_leaves',
    JSON.stringify(leaves)
  );
};

const delay = (ms = 300) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// ==============================
// AUTH API
// ==============================

export const authAPI = {
  login: async (email, password) => {
    if (USE_MOCK) {
      await delay();

      const users = getMockUsers();

      const user = users.find(
        (u) =>
          u.email.toLowerCase() ===
            email.toLowerCase() &&
          u.password === password
      );

      if (!user) {
        throw new Error(
          'Invalid email or password'
        );
      }

      const token = `mock-token-${user.id}`;

      localStorage.setItem(
        'elms_token',
        token
      );

      localStorage.setItem(
        'elms_user_id',
        user.id
      );

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          employeeId: user.employeeId,
          department: user.department,
          profilePhoto: user.profilePhoto,
          designation: user.designation,
          joinedDate: user.joinedDate,
          leaveBalance: user.leaveBalance,
        },
      };
    }

    const response = await axiosInstance.post(
      '/auth/login',
      {
        email,
        password,
      }
    );

    return response.data;
  },

  register: async (userData) => {
    if (USE_MOCK) {
      await delay();

      const users = getMockUsers();

      const existingUser = users.find(
        (u) =>
          u.email.toLowerCase() ===
          userData.email.toLowerCase()
      );

      if (existingUser) {
        throw new Error(
          'Email is already registered'
        );
      }

      const newUser = {
        id: String(Date.now()),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        employeeId: userData.employeeId,
        department: userData.department,
        role: 'employee',
        profilePhoto:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        joinedDate:
          new Date().toISOString().split('T')[0],
        designation: 'Software Associate',
        leaveBalance: {
          sick: 10,
          casual: 10,
          annual: 15,
          other: 10,
        },
      };

      users.push(newUser);

      saveMockUsers(users);

      return {
        success: true,
        message: 'Registration successful',
      };
    }

    const response = await axiosInstance.post(
      '/auth/register',
      userData
    );

    return response.data;
  },

  getCurrentUser: async () => {
    if (USE_MOCK) {
      await delay(200);

      const userId =
        localStorage.getItem('elms_user_id');

      if (!userId) {
        throw new Error('Not authenticated');
      }

      const users = getMockUsers();

      const user = users.find(
        (u) => u.id === userId
      );

      if (!user) {
        throw new Error('User not found');
      }

      return { user };
    }

    const response = await axiosInstance.get(
      '/auth/me'
    );

    return response.data;
  },
};

// ==============================
// LEAVE API
// ==============================

export const leaveAPI = {
  getLeaves: async (userId = null) => {
    if (USE_MOCK) {
      await delay();

      const leaves = getMockLeaves();

      if (userId) {
        return leaves.filter(
          (leave) => leave.userId === userId
        );
      }

      return leaves;
    }

    const url = userId
      ? `/leaves?userId=${userId}`
      : '/leaves';

    const response =
      await axiosInstance.get(url);

    return response.data;
  },

  applyLeave: async (leaveData) => {
    if (USE_MOCK) {
      await delay();

      const leaves = getMockLeaves();
      const users = getMockUsers();

      const userId =
        localStorage.getItem('elms_user_id');

      const user = users.find(
        (u) => u.id === userId
      );

      if (!user) {
        throw new Error(
          'User profile mismatch'
        );
      }

      const start = new Date(
        leaveData.startDate
      );

      const end = new Date(
        leaveData.endDate
      );

      const diffDays =
        Math.ceil(
          Math.abs(end - start) /
            (1000 * 60 * 60 * 24)
        ) + 1;

      const typeKey =
        leaveData.leaveType
          .toLowerCase()
          .split(' ')[0];

      const key =
        user.leaveBalance[typeKey] !==
        undefined
          ? typeKey
          : 'other';

      if (
        user.leaveBalance[key] < diffDays
      ) {
        throw new Error(
          `Insufficient leave balance for ${leaveData.leaveType}. Required: ${diffDays}, Available: ${user.leaveBalance[key]}`
        );
      }

      const newLeave = {
        id: `l${Date.now()}`,
        userId: user.id,
        employeeName: user.name,
        employeeId: user.employeeId,
        department: user.department,
        leaveType: leaveData.leaveType,
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        reason: leaveData.reason,
        status: 'pending',
        appliedDate:
          new Date()
            .toISOString()
            .split('T')[0],
      };

      leaves.push(newLeave);

      saveMockLeaves(leaves);

      return newLeave;
    }

    const response =
      await axiosInstance.post(
        '/leaves',
        leaveData
      );

    return response.data;
  },

  updateStatus: async (
    leaveId,
    status,
    rejectionReason = ''
  ) => {
    if (USE_MOCK) {
      await delay();

      const leaves = getMockLeaves();
      const users = getMockUsers();

      const adminId =
        localStorage.getItem(
          'elms_user_id'
        );

      const admin = users.find(
        (u) => u.id === adminId
      );

      const leaveIndex =
        leaves.findIndex(
          (leave) =>
            leave.id === leaveId
        );

      if (leaveIndex === -1) {
        throw new Error(
          'Leave request not found'
        );
      }

      const leave = leaves[leaveIndex];

      leave.status = status;

      leave.approvedBy = admin
        ? admin.name
        : 'System Admin';

      if (status === 'rejected') {
        leave.rejectionReason =
          rejectionReason;
      }

      if (status === 'approved') {
        const user = users.find(
          (u) =>
            u.id === leave.userId
        );

        if (user) {
          const start = new Date(
            leave.startDate
          );

          const end = new Date(
            leave.endDate
          );

          const diffDays =
            Math.ceil(
              Math.abs(end - start) /
                (1000 * 60 * 60 * 24)
            ) + 1;

          const typeKey =
            leave.leaveType
              .toLowerCase()
              .split(' ')[0];

          const key =
            user.leaveBalance[typeKey] !==
            undefined
              ? typeKey
              : 'other';

          user.leaveBalance[key] =
            Math.max(
              0,
              user.leaveBalance[key] -
                diffDays
            );

          saveMockUsers(users);
        }
      }

      leaves[leaveIndex] = leave;

      saveMockLeaves(leaves);

      return leave;
    }

    const response =
      await axiosInstance.patch(
        `/leaves/${leaveId}`,
        {
          status,
          rejectionReason,
        }
      );

    return response.data;
  },
};

// ==============================
// EMPLOYEE API
// ==============================

export const employeeAPI = {
  getEmployees: async () => {
    if (USE_MOCK) {
      await delay();

      const users = getMockUsers();

      return users.filter(
        (user) =>
          user.role === 'employee'
      );
    }

    const response =
      await axiosInstance.get(
        '/employees'
      );

    return response.data;
  },

  addEmployee: async (
    employeeData
  ) => {
    if (USE_MOCK) {
      await delay();

      const users = getMockUsers();

      const existingUser =
        users.find(
          (u) =>
            u.email.toLowerCase() ===
            employeeData.email.toLowerCase()
        );

      if (existingUser) {
        throw new Error(
          'Email is already in use'
        );
      }

      const newEmployee = {
        id: String(Date.now()),
        name: employeeData.name,
        email: employeeData.email,
        password:
          employeeData.password ||
          'password123',
        employeeId:
          employeeData.employeeId,
        department:
          employeeData.department,
        role: 'employee',
        profilePhoto:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        joinedDate:
          employeeData.joinedDate ||
          new Date()
            .toISOString()
            .split('T')[0],
        designation:
          employeeData.designation ||
          'Software Associate',
        leaveBalance: {
          sick: 10,
          casual: 10,
          annual: 15,
          other: 10,
        },
      };

      users.push(newEmployee);

      saveMockUsers(users);

      return newEmployee;
    }

    const response =
      await axiosInstance.post(
        '/employees',
        employeeData
      );

    return response.data;
  },

  updateEmployee: async (
    id,
    employeeData
  ) => {
    if (USE_MOCK) {
      await delay();

      const users = getMockUsers();

      const userIndex =
        users.findIndex(
          (user) => user.id === id
        );

      if (userIndex === -1) {
        throw new Error(
          'Employee not found'
        );
      }

      users[userIndex] = {
        ...users[userIndex],
        ...employeeData,
      };

      saveMockUsers(users);

      return users[userIndex];
    }

    const response =
      await axiosInstance.put(
        `/employees/${id}`,
        employeeData
      );

    return response.data;
  },

  deleteEmployee: async (id) => {
    if (USE_MOCK) {
      await delay();

      const users = getMockUsers();

      const updatedUsers =
        users.filter(
          (user) => user.id !== id
        );

      saveMockUsers(updatedUsers);

      return {
        success: true,
      };
    }

    const response =
      await axiosInstance.delete(
        `/employees/${id}`
      );

    return response.data;
  },
};

// ==============================
// REPORT API
// ==============================

export const reportAPI = {
  getReportData: async () => {
    if (USE_MOCK) {
      await delay();

      const leaves = getMockLeaves();

      const users = getMockUsers();

      const employees =
        users.filter(
          (user) =>
            user.role === 'employee'
        );

      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      const monthlyCount =
        Array(12).fill(0);

      leaves.forEach((leave) => {
        if (
          leave.status === 'approved'
        ) {
          const date = new Date(
            leave.startDate
          );

          const monthIndex =
            date.getMonth();

          if (!isNaN(monthIndex)) {
            monthlyCount[monthIndex]++;
          }
        }
      });

      const monthlyChart =
        months.map(
          (month, index) => ({
            label: month,
            value:
              monthlyCount[index],
          })
        );

      const departmentSummary = {};

      employees.forEach((employee) => {
        if (
          !departmentSummary[
            employee.department
          ]
        ) {
          departmentSummary[
            employee.department
          ] = {
            total: 0,
            approvedLeaves: 0,
          };
        }

        departmentSummary[
          employee.department
        ].total++;
      });

      leaves.forEach((leave) => {
        if (
          leave.status === 'approved' &&
          departmentSummary[
            leave.department
          ]
        ) {
          departmentSummary[
            leave.department
          ].approvedLeaves++;
        }
      });

      const departments =
        Object.keys(
          departmentSummary
        ).map((department) => ({
          departmentName:
            department,
          employeeCount:
            departmentSummary[
              department
            ].total,
          approvedLeavesCount:
            departmentSummary[
              department
            ].approvedLeaves,
        }));

      return {
        monthlyChart,
        departments,
        totals: {
          totalEmployees:
            employees.length,
          totalRequests:
            leaves.length,
          pendingRequests:
            leaves.filter(
              (leave) =>
                leave.status === 'pending'
            ).length,
          approvedRequests:
            leaves.filter(
              (leave) =>
                leave.status === 'approved'
            ).length,
          rejectedRequests:
            leaves.filter(
              (leave) =>
                leave.status === 'rejected'
            ).length,
        },
      };
    }

    const response =
      await axiosInstance.get(
        '/reports'
      );

    return response.data;
  },
};

export default axiosInstance;