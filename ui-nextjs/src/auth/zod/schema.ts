import { AUHT_MENSSAGES } from "@/config/config";
import { z } from "zod";

const whatsappRegex = /^[1-9]{2}9[0-9]{8}$/;

export const registerSchema = z
  .object({
    firstName: z.string().min(2, AUHT_MENSSAGES.firstNameError),
    lastName: z.string().min(2, AUHT_MENSSAGES.lastNameError),
    email: z.string().email(AUHT_MENSSAGES.invalidEmail),
    confirmEmail: z.string().email(AUHT_MENSSAGES.confirmEmail),
    whatsappNumber: z
      .string()
      .min(1, AUHT_MENSSAGES.minWhatsappError)
      .regex(whatsappRegex, AUHT_MENSSAGES.regexWhatsappError),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: AUHT_MENSSAGES.confirmEmail,
    path: ["confirmEmail"],
  });

export type RegisterFormOutput = Omit<
  z.infer<typeof registerSchema>,
  "confirmEmail"
>;

export const loginSchema = z.object({
  destination: z.string().email(AUHT_MENSSAGES.invalidEmail),
});

export const profileSchema = z.object({
  firstName: z.string().min(2, AUHT_MENSSAGES.firstNameError),
  lastName: z.string().min(2, AUHT_MENSSAGES.lastNameError),
  whatsappNumber: z
    .string()
    .min(1, AUHT_MENSSAGES.minWhatsappError)
    .regex(whatsappRegex, AUHT_MENSSAGES.regexWhatsappError),
});
