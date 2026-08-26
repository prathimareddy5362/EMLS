import React, { useState } from 'react';

import Input from './Input';

import {
  IoSearchOutline,
} from 'react-icons/io5';

const Table = ({
  headers = [],
  data = [],
  renderRow,
  searchPlaceholder = 'Search records...',
  searchField = '',
  actions,
  noDataMessage = 'No records found',
}) => {
  const [searchTerm, setSearchTerm] =
    useState('');

  // ==============================
  // SAFE ARRAYS
  // ==============================

  const safeHeaders =
    Array.isArray(headers)
      ? headers
      : [];

  const safeData =
    Array.isArray(data)
      ? data
      : [];

  // ==============================
  // FILTER DATA
  // ==============================

  const filteredData =
    safeData.filter((item) => {
      if (!searchTerm) {
        return true;
      }

      if (
        !item ||
        typeof item !== 'object'
      ) {
        return false;
      }

      const searchLower =
        searchTerm.toLowerCase();

      // Search specific field

      if (searchField) {
        const value =
          item[searchField];

        return String(
          value || ''
        )
          .toLowerCase()
          .includes(searchLower);
      }

      // Search all fields

      return Object.values(item).some(
        (value) => {
          if (
            value === null ||
            value === undefined
          ) {
            return false;
          }

          return String(value)
            .toLowerCase()
            .includes(searchLower);
        }
      );
    });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* ==========================
          TABLE HEADER ACTION BAR
      ========================== */}

      {(searchPlaceholder || actions) && (
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems:
              'center',
            gap: '1rem',
            flexWrap:
              'wrap',
          }}
        >
          {/* SEARCH */}

          {searchPlaceholder && (
            <div
              style={{
                width: '100%',
                maxWidth: '300px',
              }}
            >
              <Input
                type="text"
                placeholder={
                  searchPlaceholder
                }
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                icon={IoSearchOutline}
              />
            </div>
          )}

          {/* ACTIONS */}

          {actions && (
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                marginLeft: 'auto',
              }}
            >
              {actions}
            </div>
          )}
        </div>
      )}

      {/* ==========================
          MAIN TABLE
      ========================== */}

      <div
        className="
          glass-table-container
          glass-scroll
        "
      >
        {filteredData.length === 0 ? (
          <div
            style={{
              padding:
                '3rem 1.5rem',

              textAlign:
                'center',

              color:
                'var(--text-secondary)',

              fontSize:
                '1rem',
            }}
          >
            {noDataMessage}
          </div>
        ) : (
          <table className="glass-table">

            {/* TABLE HEADERS */}

            <thead>
              <tr>
                {safeHeaders.map(
                  (
                    header,
                    index
                  ) => (
                    <th
                      key={index}
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody>
              {filteredData.map(
                (
                  item,
                  index
                ) => {
                  // Custom row renderer

                  if (
                    typeof renderRow ===
                    'function'
                  ) {
                    return renderRow(
                      item,
                      index
                    );
                  }

                  // Default row renderer

                  return (
                    <tr
                      key={
                        item?.id ||
                        index
                      }
                    >
                      {Object.keys(
                        item || {}
                      ).map(
                        (
                          key,
                          subIndex
                        ) => (
                          <td
                            key={
                              subIndex
                            }
                          >
                            {String(
                              item[key] ??
                              ''
                            )}
                          </td>
                        )
                      )}
                    </tr>
                  );
                }
              )}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
};

export default Table;