import React from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { clsx } from 'clsx';

interface BulkAction {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline';
  onClick: () => void;
}

interface BulkActionsProps {
  selectedCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
  className?: string;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  actions,
  onClearSelection,
  className
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className={clsx(
      'flex items-center justify-between p-4 bg-pink-50 border border-pink-200 rounded-lg',
      className
    )}>
      <div className="flex items-center gap-3">
        <Badge variant="secondary">
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-slate-600 hover:text-slate-900"
        >
          Clear selection
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.key}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.onClick}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};