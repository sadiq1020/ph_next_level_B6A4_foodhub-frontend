"use client";

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type CheckoutFormData = {
  notes?: string;
  // deliveryAddress removed — digital product
  // phone removed
};

interface CheckoutFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

export function CheckoutForm({ register, errors }: CheckoutFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
        Enrollment Details
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        You&apos;re enrolling in a digital course. No shipping required.
      </p>

      <FieldGroup>
        {/* Access Info */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 mb-4">
          <span className="text-2xl">🎓</span>
          <div>
            <p className="font-medium text-green-900 dark:text-green-100 text-sm">
              Instant Access
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
              You&apos;ll get access to all course materials immediately after enrollment.
              Access is valid for 1 year.
            </p>
          </div>
        </div>

        {/* Notes — optional */}
        <Field>
          <FieldLabel htmlFor="notes">Notes (Optional)</FieldLabel>
          <Textarea
            id="notes"
            placeholder="Any questions or special requests for the instructor?"
            rows={3}
            {...register("notes")}
          />
        </Field>

        {/* Payment Method */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-5 mt-2">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Payment Method
          </h3>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center">
              <span className="text-xl">💳</span>
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50 text-sm">
                Online Payment
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Secure payment — access granted immediately
              </p>
            </div>
          </div>
        </div>
      </FieldGroup>
    </div>
  );
}