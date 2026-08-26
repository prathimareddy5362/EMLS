import React, { useState } from 'react';
import Input from './Input';
import { IoSearchOutline } from 'react-icons/io5';

const Table = ({
  headers = [],
  data = [],
  renderRow,
  searchPlaceholder = 'Search records...',
  searchField = '', // Field name to search, or empty string to search all text fields
  actions,
  noDataMessage = 'No records found'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();

    if (searchField) {
      const val = item[searchField];
      return val && String(val).toLowerCase().includes(searchLower);
    }

    // Search across all text/number fields in the object
    return Object.values(item).some((value) => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchLower);
    });
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Table Header Action Bar */}
      {(searchPlaceholder || actions) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {searchPlaceholder && (
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={IoSearchOutline}
              />
            </div>
          )}
          {actions && <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>{actions}</div>}
        </div>
      )}

      {/* Main Table Grid */}
      <div className="glass-table-container glass-scroll">
        {filteredData.length === 0 ? (
          <div
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '1rem',
            }}
          >
            {noDataMessage}
          </div>
        ) : (
          <table className="glass-table">
            <thead>
              <tr>
                {headers.map((header, idx) => (
                  <th key={idx}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => {
                if (renderRow) {
                  return renderRow(item, idx);
                }
                
                // Fallback basic cell rendering
                return (
                  <tr key={idx}>
                    {Object.keys(item).map((key, subIdx) => (
                      <td key={subIdx}>{String(item[key])}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Table;
