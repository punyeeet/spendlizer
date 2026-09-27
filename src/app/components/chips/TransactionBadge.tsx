import React from 'react';
import { BsArrowDownLeft, BsArrowUpRight } from 'react-icons/bs';

interface TransactionBadgeProps {
  type: 'credit' | 'debit' | string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const TransactionBadge: React.FC<TransactionBadgeProps> = ({
  type,
  size = 'md',
  showIcon = true,
}) => {
  const isCredit = type?.toLowerCase() === 'credit';

  const sizeStyle =
    size === 'sm'
      ? 'text-xs px-2 py-0.5 gap-1 font-medium'
      : 'text-xs px-3 py-1 gap-1.5 font-semibold';

  if (isCredit) {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs tracking-wide uppercase ${sizeStyle}`}
      >
        {showIcon && (
          <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-200/60 text-emerald-800">
            <BsArrowDownLeft className="w-2.5 h-2.5" />
          </span>
        )}
        <span>Credit</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs tracking-wide uppercase ${sizeStyle}`}
    >
      {showIcon && (
        <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-rose-200/60 text-rose-800">
          <BsArrowUpRight className="w-2.5 h-2.5" />
        </span>
      )}
      <span>Debit</span>
    </span>
  );
};

export default TransactionBadge;
