import React from 'react';

const LeaveChart = ({ data = [], title = 'Leave Summary' }) => {
  // Find the maximum value to scale the bars proportionally
  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value), 1) : 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%' }}>
      {title && (
        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {title}
        </h4>
      )}
      
      {data.length === 0 ? (
        <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          No data available
        </div>
      ) : (
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            height: '240px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            padding: '1.25rem 1rem',
            border: '1px solid rgba(255, 255, 255, 0.04)'
          }}
        >
          {/* Chart Bars */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'space-around', 
              flexGrow: 1,
              height: '180px',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {data.map((item, idx) => {
              const percentage = (item.value / maxValue) * 100;
              return (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    height: '100%', 
                    justifyContent: 'flex-end',
                    flexGrow: 1,
                    maxWidth: '40px'
                  }}
                >
                  {/* Tooltip on hover */}
                  <div 
                    style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--primary)', 
                      fontWeight: 600,
                      marginBottom: '0.25rem',
                      opacity: item.value > 0 ? 1 : 0.3
                    }}
                  >
                    {item.value}
                  </div>
                  
                  {/* The Bar */}
                  <div 
                    style={{ 
                      width: '60%', 
                      height: `${Math.max(percentage, 5)}%`, 
                      background: 'linear-gradient(to top, var(--primary), var(--secondary))',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)',
                      transition: 'height 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'brightness(1.2)';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'none';
                      e.currentTarget.style.boxShadow = '0 0 10px rgba(99, 102, 241, 0.3)';
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Labels */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              alignItems: 'center', 
              paddingTop: '0.5rem'
            }}
          >
            {data.map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--text-muted)', 
                  fontWeight: 500,
                  width: '100%',
                  textAlign: 'center',
                  maxWidth: '40px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveChart;
