import { z } from "zod";

// Schema for signing in

export const SignInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for signing up

export const SignUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
export const UpdateUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

export const CreateHouseholdSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
});

export const CreateBillSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  amount: z.coerce.number().positive(),
  categoryId: z.string().min(1),
  paidById: z.string().min(1),
  splitEvenly: z.union([z.literal("true"), z.literal("false")]),
  splitWith: z.union([
    z.array(z.string()),
    z.string(), // edge case: single checkbox
  ]),
  customSplits: z.array(z.string()).optional(),
});

export const BillDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  amount: z.number(),
  createdAt: z.date(),
  isSettled: z.boolean(),

  category: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),

  paidBy: z.object({
    id: z.string(),
    name: z.string(),
  }),

  billSplits: z.array(
    z.object({
      id: z.string(),
      billId: z.string(),
      userId: z.string(),
      amountOwed: z.number(),
      hasPaid: z.boolean(),
      paymentConfirmed: z.boolean(),
      note: z.string().nullable(),

      user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().optional(), // optional depending on your use
      }),
    })
  ),
});
