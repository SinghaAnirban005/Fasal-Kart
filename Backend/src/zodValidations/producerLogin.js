import { producerZodSchema } from "./producerZodSchema.js"

const loginZodSchema = producerZodSchema.pick(
    {
        phoneNumber: true,
        password: true
    }
)

const validateLoginData = (data) => {
    const result = loginZodSchema.safeParse(data);
    if (!result.success) {
        console.error(result.error.errors); 
        throw new Error("Validation failed");
    }
    return result.data; 
}   

export { validateLoginData }