import axios from 'axios';

// ==============================
// AXIOS CONFIGURATION
// ==============================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('elms_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// AUTH API
// ==============================

export const authAPI = {
  // --------------------------
  // LOGIN
  // --------------------------
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post(
        '/auth/login',
        {
          email,
          password,
        }
      );

      const data = response.data;

      /*
        Backend may return:

        {
          success: true,
          message: "Login successful",
          employee: {...}
        }

        OR future backend:

        {
          success: true,
          token: "...",
          user: {...}
        }
      */

      const backendUser =
        data.user || data.employee;

      if (!backendUser) {
        throw new Error(
          data.message ||
            'User data not received from server'
        );
      }

      // Normalize backend user fields
      const user = {
        id: backendUser.id,

        name:
          backendUser.name ||
          backendUser.full_name ||
          '',

        email:
          backendUser.email || '',

        employeeId:
          backendUser.employeeId ||
          backendUser.employee_id ||
          '',

        department:
          backendUser.department || '',

        role:
          backendUser.role ||
          'employee',

        designation:
          backendUser.designation ||
          'Employee',

        profilePhoto:
          backendUser.profilePhoto ||
          '',

        leaveBalance:
          backendUser.leaveBalance || {
            sick: 10,
            casual: 10,
            annual: 15,
            other: 10,
          },
      };

      // Use backend token if available
      // Otherwise create temporary session token
      const token =
        data.token ||
        `session-${user.id}`;

      // Save session
      localStorage.setItem(
        'elms_token',
        token
      );

      localStorage.setItem(
        'elms_user_id',
        String(user.id)
      );

      localStorage.setItem(
        'elms_user',
        JSON.stringify(user)
      );

      return {
        success: true,
        message:
          data.message ||
          'Login successful',

        token,
        user,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed';

      throw new Error(message);
    }
  },

  // --------------------------
  // REGISTER
  // --------------------------
  register: async (userData) => {
    try {
      const response =
        await axiosInstance.post(
          '/auth/register',
          userData
        );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed';

      throw new Error(message);
    }
  },

  // --------------------------
  // GET CURRENT USER
  // --------------------------
  getCurrentUser: async () => {
    try {
      const response =
        await axiosInstance.get(
          '/auth/me'
        );

      const data = response.data;

      const backendUser =
        data.user || data.employee;

      if (!backendUser) {
        throw new Error(
          'User data not received'
        );
      }

      const user = {
        id: backendUser.id,

        name:
          backendUser.name ||
          backendUser.full_name ||
          '',

        email:
          backendUser.email || '',

        employeeId:
          backendUser.employeeId ||
          backendUser.employee_id ||
          '',

        department:
          backendUser.department || '',

        role:
          backendUser.role ||
          'employee',

        designation:
          backendUser.designation ||
          'Employee',

        profilePhoto:
          backendUser.profilePhoto ||
          '',

        leaveBalance:
          backendUser.leaveBalance || {
            sick: 10,
            casual: 10,
            annual: 15,
            other: 10,
          },
      };

      return {
        ...data,
        user,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to get current user';

      throw new Error(message);
    }
  },

  // --------------------------
  // LOGOUT
  // --------------------------
  logout: () => {
    localStorage.removeItem(
      'elms_token'
    );

    localStorage.removeItem(
      'elms_user_id'
    );

    localStorage.removeItem(
      'elms_user'
    );
  },
};

// ==============================
// LEAVE API
// ==============================

export const leaveAPI = {
  // --------------------------
  // GET LEAVES
  // --------------------------
  getLeaves: async (userId = null) => {
    try {
      const url = userId
        ? `/leaves?userId=${userId}`
        : '/leaves';

      const response =
        await axiosInstance.get(url);

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch leaves';

      throw new Error(message);
    }
  },

  // --------------------------
  // APPLY LEAVE
  // --------------------------
  applyLeave: async (leaveData) => {
    try {
      const response =
        await axiosInstance.post(
          '/leaves',
          leaveData
        );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to apply leave';

      throw new Error(message);
    }
  },

  // --------------------------
  // UPDATE LEAVE STATUS
  // --------------------------
  updateStatus: async (
    leaveId,
    status,
    rejectionReason = ''
  ) => {
    try {
      const response =
        await axiosInstance.patch(
          `/leaves/${leaveId}`,
          {
            status,
            rejectionReason,
          }
        );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to update leave status';

      throw new Error(message);
    }
  },
};

// ==============================
// EMPLOYEE API
// ==============================

export const employeeAPI = {
  // --------------------------
  // GET EMPLOYEES
  // --------------------------
  getEmployees: async () => {
    try {
      const response =
        await axiosInstance.get(
          '/employees'
        );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch employees';

      throw new Error(message);
    }
  },

  // --------------------------
  // ADD EMPLOYEE
  // --------------------------
  addEmployee: async (
    employeeData
  ) => {
    try {
      const response =
        await axiosInstance.post(
          '/employees',
          employeeData
        );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to add employee';

      throw new Error(message);
    }
  },

  // --------------------------
  // UPDATE EMPLOYEE
  // --------------------------
  updateEmployee: async (
    id,
    employeeData
  ) => {
    try {
      const response =
        await axiosInstance.put(
          `/employees/${id}`,
          employeeData
        );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to update employee';

      throw new Error(message);
    }
  },

  // --------------------------
  // DELETE EMPLOYEE
  // --------------------------
  deleteEmployee: async (id) => {
    try {
      const response =
        await axiosInstance.delete(
          `/employees/${id}`
        );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete employee';

      throw new Error(message);
    }
  },
};

// ==============================
// REPORT API
// ==============================

export const reportAPI = {
  getReportData: async () => {
    try {
      const response =
        await axiosInstance.get(
          '/reports'
        );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch report data';

      throw new Error(message);
    }
  },
};

// ==============================
// EXPORT AXIOS INSTANCE
// ==============================

export default axiosInstance;