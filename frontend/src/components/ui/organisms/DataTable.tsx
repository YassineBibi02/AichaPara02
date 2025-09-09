import React, { useState, useMemo } from 'react';
import { TableHeader, Column } from '../molecules/TableHeader';
import { TableRow } from '../molecules/TableRow';
import { PaginationControls } from '../molecules/PaginationControls';
import { TableFilters } from '../molecules/TableFilters';
import { BulkActions } from '../molecules/BulkActions';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { clsx } from 'clsx';

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column[];
  loading?: boolean;
  error?: string;
  
  // Pagination
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  
  // Sorting
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  
  // Selection
  selectedItems?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  getItemId?: (item: T) => string;
  
  // Filtering
  filters?: Array<{
    key: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'datetime';
    options?: { value: string; label: string }[];
    placeholder?: string;
  }>;
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onFilterClear?: () => void;
  
  // Bulk actions
  bulkActions?: Array<{
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    variant?: 'default' | 'destructive' | 'outline';
    onClick: (selectedIds: string[]) => void;
  }>;
  
  // Row rendering
  renderRow: (item: T, index: number) => React.ReactNode;
  
  // Empty state
  emptyMessage?: string;
  
  className?: string;
  tableClassName?: string;
}

export function DataTable<T = any>({
  data,
  columns,
  loading = false,
  error,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  sortColumn,
  sortDirection,
  onSort,
  selectedItems = [],
  onSelectionChange,
  getItemId = (item: any) => item.id,
  filters = [],
  filterValues = {},
  onFilterChange,
  onFilterClear,
  bulkActions = [],
  renderRow,
  emptyMessage = 'No data available',
  className,  
  tableClassName
}: DataTableProps<T>) {
  const showCheckbox = !!onSelectionChange;
  const showFilters = filters.length > 0;
  const showBulkActions = bulkActions.length > 0 && selectedItems.length > 0;

  // Selection logic
  const allSelected = data.length > 0 && selectedItems.length === data.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < data.length;

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = data.map(getItemId);
      onSelectionChange?.(allIds);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleItemSelect = (itemId: string, selected: boolean) => {
    if (selected) {
      onSelectionChange?.([...selectedItems, itemId]);
    } else {
      onSelectionChange?.(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleBulkAction = (action: any) => {
    action.onClick(selectedItems);
  };

  // Prepare bulk actions with handlers
  const preparedBulkActions = bulkActions.map(action => ({
    ...action,
    onClick: () => handleBulkAction(action)
  }));

  return (
    <div className={clsx('space-y-4', className)}>
      {/* Filters */}
      {showFilters && (
        <TableFilters
          filters={filters}
          values={filterValues}
          onChange={onFilterChange!}
          onClear={onFilterClear!}
        />
      )}

      {/* Bulk Actions */}
      {showBulkActions && (
        <BulkActions
          selectedCount={selectedItems.length}
          actions={preparedBulkActions}
          onClearSelection={() => onSelectionChange?.([])}
        />
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className={clsx("bg-white border border-slate-200 rounded-lg overflow-hidden")}>
        <div className={clsx("overflow-x-auto", tableClassName)}>
          <table className="w-full">
            <TableHeader
              columns={columns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              showCheckbox={showCheckbox}
              allSelected={allSelected}
              someSelected={someSelected}
              onSelectAll={handleSelectAll}
            />
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (showCheckbox ? 1 : 0)} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <LoadingSpinner />
                      <span className="text-slate-600">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (showCheckbox ? 1 : 0)} className="p-8 text-center">
                    <p className="text-slate-600">{emptyMessage}</p>
                  </td>
                </tr>
              ) : (
                data.map((item, index) => {
                  const itemId = getItemId(item);
                  const isSelected = selectedItems.includes(itemId);
                  
                  return (
                    <TableRow
                      key={itemId}
                      selected={isSelected}
                      onSelect={(selected) => handleItemSelect(itemId, selected)}
                      showCheckbox={showCheckbox}
                    >
                      {renderRow(item, index)}
                    </TableRow>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange!}
          onPageSizeChange={onPageSizeChange!}
        />
      )}
    </div>
  );
}