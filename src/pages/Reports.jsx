import React, { useState, useEffect } from 'react';
import { reportAPI } from '../services/api';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import LeaveChart from '../components/charts/LeaveChart';
import Table from '../components/common/Table';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const data = await reportAPI.getReportData();
        setReportData(data);
      } catch (error) {
        console.error('Failed to load reports data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  if (loading || !reportData) {
    return <Loader />;
  }

  const { monthlyChart, departments, totals } = reportData;

  const departmentHeaders = ['Department Name', 'Staff Count', 'Approved Leaves'];
  
  const renderDeptRow = (dept, index) => (
    <tr key={index}>
      <td style={{ fontWeight: 600 }}>{dept.departmentName}</td>
      <td>{dept.employeeCount} {dept.employeeCount === 1 ? 'employee' : 'employees'}</td>
      <td>{dept.approvedLeavesCount} {dept.approvedLeavesCount === 1 ? 'day' : 'days'} approved</td>
    </tr>
  );

  return (
    <div style={{ flexGrow: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">System Reports</h1>
          <p className="page-subtitle">Visual summaries of leave frequencies and distributions</p>
        </div>
      </div>

      <div className="layout-grid">
        {/* Left Side: Summary and Table */}
        <div className="grid-col-6">
          <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Department Distribution</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Leaves and staffing ratios</p>
            </div>
            
            <Table
              headers={departmentHeaders}
              data={departments}
              renderRow={renderDeptRow}
              searchPlaceholder="" // Hide search on reports
            />
          </Card>
        </div>

        {/* Right Side: Charts */}
        <div className="grid-col-6">
          <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Annual Outages</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Approved leaves by calendar month</p>
            </div>
            
            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <LeaveChart data={monthlyChart} title="" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
