import { clsx } from 'clsx'
import { forwardRef } from 'react'
import { Check, Minus } from 'lucide-react'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate, onChange, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="checkbox"
          className={clsx(
            'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
            className
          )}
          ref={ref}
          onChange={(e) => onChange?.(e.target.checked)}
          {...props}
        />
        {props.checked && (
          <Check className="absolute inset-0 h-4 w-4 text-white pointer-events-none" />
        )}
        {indeterminate && !props.checked && (
          <Minus className="absolute inset-0 h-4 w-4 text-white pointer-events-none" />
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'