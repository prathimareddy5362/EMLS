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

// ==============================
// REQUEST INTERCEPTOR
// Automatically attach JWT token
// ==============================

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('elms_token');

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ==============================
// RESPONSE INTERCEPTOR
// Handle expired / invalid token
// ==============================

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401
    ) {
      localStorage.removeItem(
        'elms_token'
      );

      localStorage.removeItem(
        'elms_user'
      );

      localStorage.removeItem(
        'elms_user_id'
      );
    }

    return Promise.reject(error);
  }
);

// ==============================
// AUTH API
// ==============================

export const authAPI = {

  // --------------------------
  // LOGIN
  // --------------------------

  login: async (
    email,
    password
  ) => {
    try {
      const response =
        await axiosInstance.post(
          '/auth/login',
          {
            email,
            password,
          }
        );

      const data =
        response.data;

      if (!data.success) {
        throw new Error(
          data.message ||
          'Login failed'
        );
      }

      if (!data.user) {
        throw new Error(
          'User data not received from server'
        );
      }

      if (!data.token) {
        throw new Error(
          'Authentication token not received'
        );
      }

      // Normalize user data

      const user = {
        id:
          data.user.id,

        name:
          data.user.name ||
          '',

        email:
          data.user.email ||
          '',

        employeeId:
          data.user.employeeId ||
          '',

        department:
          data.user.department ||
          '',

        role:
          data.user.role ||
          'employee',

        designation:
          data.user.designation ||
          'Employee',

        profilePhoto:
          data.user.profilePhoto ||
          '',

        leaveBalance:
          data.user.leaveBalance || {
            sick: 10,
            casual: 10,
            annual: 15,
            other: 10,
          },
      };

      return {
        success: true,

        message:
          data.message ||
          'Login successful',

        token:
          data.token,

        user,
      };

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed';

      throw new Error(
        message
      );
    }
  },


  // --------------------------
  // REGISTER
  // --------------------------

  register: async (
    userData
  ) => {
    try {
      const response =
        await axiosInstance.post(
          '/auth/register',
          userData
        );

      const data =
        response.data;

      if (!data.success) {
        throw new Error(
          data.message ||
          'Registration failed'
        );
      }

      return data;

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed';

      throw new Error(
        message
      );
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

      const data =
        response.data;

      if (!data.success) {
        throw new Error(
          data.message ||
          'Failed to get current user'
        );
      }

      if (!data.user) {
        throw new Error(
          'User data not received'
        );
      }

      // Normalize user data

      const user = {
        id:
          data.user.id,

        name:
          data.user.name ||
          '',

        email:
          data.user.email ||
          '',

        employeeId:
          data.user.employeeId ||
          '',

        department:
          data.user.department ||
          '',

        role:
          data.user.role ||
          'employee',

        designation:
          data.user.designation ||
          'Employee',

        profilePhoto:
          data.user.profilePhoto ||
          '',

        leaveBalance:
          data.user.leaveBalance || {
            sick: 10,
            casual: 10,
            annual: 15,
            other: 10,
          },
      };

      return {
        success: true,

        user,
      };

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to get current user';

      throw new Error(
        message
      );
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
      'elms_user'
    );

    localStorage.removeItem(
      'elms_user_id'
    );
  },
};


// ==============================
// LEAVE API
// ==============================

// ==============================
// LEAVE API
// ==============================

export const leaveAPI = {

  // --------------------------
  // GET MY LEAVES
  // --------------------------

  getLeaves: async () => {
    try {
      const response =
        await axiosInstance.get(
          "/leaves"
        );

      return response.data;

    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch leave requests"
      );
    }
  },

  // --------------------------
  // GET ALL LEAVES
  // ADMIN ONLY
  // --------------------------

  getAllLeaves: async () => {
    try {
      const response =
        await axiosInstance.get(
          "/leaves/all"
        );

      return response.data;

    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch all leave requests"
      );
    }
  },

  // --------------------------
  // APPLY LEAVE
  // --------------------------

  applyLeave: async (
    leaveData
  ) => {
    try {
      const response =
        await axiosInstance.post(
          "/leaves",
          leaveData
        );

      return response.data;

    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to apply leave"
      );
    }
  },

  // --------------------------
  // UPDATE LEAVE STATUS
  // ADMIN ONLY
  // --------------------------

  updateStatus: async (
    leaveId,
    status,
    rejectionReason = ""
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
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to update leave status"
      );
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

      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch employees'
      );
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

      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to add employee'
      );
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

      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to update employee'
      );
    }
  },


  // --------------------------
  // DELETE EMPLOYEE
  // --------------------------

  deleteEmployee: async (
    id
  ) => {
    try {
      const response =
        await axiosInstance.delete(
          `/employees/${id}`
        );

      return response.data;

    } catch (error) {

      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to delete employee'
      );
    }
  },
};


// ==============================
// REPORT API
// ==============================

export const reportAPI = {


  // --------------------------
  // GET REPORT DATA
  // --------------------------

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

      throw new Error(
        message
      );
    }
  },
};


// ==============================
// EXPORT AXIOS INSTANCE
// ==============================

export default axiosInstance;