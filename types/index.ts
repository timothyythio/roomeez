import { BillDetailSchema } from "@/lib/validators";
import { z } from "zod";

export type BillDetailType = z.infer<typeof BillDetailSchema>;
