import { consumerZodSchema } from "./consumerZodSchema.js";

const loginZodSchema = consumerZodSchema.pick({
    email: true,
    password: true,
});

const validateLoginData = (data) => {
    const result = loginZodSchema.safeParse(data);
    if (!result.success) {
        console.error(result.error.errors); 
        throw new Error("Validation failed");
    }
    return result.data; 
};

export { validateLoginData };
