import { z } from "zod"

const producerZodSchema = z.object(
    {
        fullName: z.string()
            .min(1, "Full Name is required")
            .trim()
            .max(50, "Full Name cannot exceed 50 characters"),

        province: z.string()
            .trim(),

        phoneNumber: z.number()
            .int("Phone number must be an integer")
            .positive("Phone number must be a positive number"),

        Language: z.string()
            .trim(),

        Stock: z.array(z.string().uuid())
            .optional,
        
        refreshToken: z.string()
            .trim()
            .optional(),
        
        rating: z.array(z.string().uuid())
            .optional(),

        password: z.string()
            .min(6, "Password must be atleast 6 characters")
            .max(12, "Password must not have more than 12 characters")
            .trim(),
    }
)

const validateProducerData = (data) => {
    const result = producerZodSchema.safeParse(data);
    if (!result.success) {
        console.error(result.error.errors); 
        throw new Error("Validation failed");
    }
    return result.data; 
};

export { producerZodSchema, validateProducerData };