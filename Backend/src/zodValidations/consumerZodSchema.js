import { z } from "zod"

const consumerZodSchema = z.object(
    {
        fullName: z.string()
            .min(1, "Full Name is required")
            .trim()
            .max(50, "Full Name cannot exceed 50 characters"),

        username: z.string()
            .min(6, "Username mmust be at Least 6 charcters")
            .max(12, "Username cannot exceed 12 characters"),

        password: z.string()
            .min(6, "Password must be atleast 6 characters")
            .max(12, "Password must not have more than 12 characters")
            .trim(),
        
        email: z.string()
            .email("Invalid email format")
            .trim(),
            
        refreshToken: z.string().optional(),
    
        province: z.string()
            .min(1, "Province is required"),
    
        Cart: z.array(z.string().uuid())
            .optional(),
    
        phoneNumber: z.number()
            .int("Phone number must be an integer")
            .positive("Phone number must be a positive number"),
    
        itemsBought: z.array(z.string().uuid()).optional(),
    
        Transactions: z.array(z.string().uuid()).optional(),
    }
)

const validateConsumerData = (data) => {
    const result = consumerZodSchema.safeParse(data);
    if (!result.success) {
        console.error(result.error.errors); 
        throw new Error("Validation failed");
    }
    return result.data; 
};

export { consumerZodSchema, validateConsumerData };