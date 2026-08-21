"use client";

import { useTransition } from "react";
import { toggleUserPermission } from "./actions";
import { Check, X } from "lucide-react";

interface Props {
  userId: string;
  field: string;
  initialValue: boolean;
  disabled?: boolean;
}

export default function PermissionToggle({ userId, field, initialValue, disabled }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (disabled) return;
    startTransition(() => {
      toggleUserPermission(userId, field, !initialValue);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={disabled || isPending}
      className={`relative inline-flex h-6 w-11 items-center rounded-none transition-colors focus:outline-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${initialValue ? 'bg-indigo-600' : 'bg-slate-700'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform bg-white rounded-none transition-transform ${
          initialValue ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
