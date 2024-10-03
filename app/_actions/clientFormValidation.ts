"use server";
import { $fetch } from "@/app/api/user/api.fetchUser";
import { sanitizeInput } from "@/app/_actions/handleRawInput";
import type { PasswordRules } from "@/app/(auth)/register/page";

export async function emailValidator(email: string | undefined) {

    if (!email) return "Email is required";
    if (!email?.includes('@')) return "Emails must contain '@' symbol";

    const getUserResponse = await $fetch.get({email: email});
    const data = await getUserResponse.json();
    if (getUserResponse.ok && data.exists) return "This email already exists";

    const emailSanitized = await sanitizeInput(email);
    if (!emailSanitized) return "Email contains illegal characters";
    
    return true;
}


export async function passwordValidator(password: string | undefined, prevCriteria: PasswordRules) {
    
    if (!password) return "Password is required";

    const passwordSanitized = await sanitizeInput(password);
    if (!passwordSanitized) return "Password contains illegal characters";

    
    const tests = [/[a-z]/.test(password), /[A-Z]/.test(password), /[0-9]/.test(password), 
        /[!@#^&*()+_,.{}?-]/.test(password), password.length >= 8, password.length <= 20
    ];
    
    let correctRequirements = 0;
    const newPasswordCriteria = prevCriteria.map((item, index) => {  
        item.status = tests[index];
        if (item.status) {
            correctRequirements += 1;
        }
        return item;
    });

    if (correctRequirements === tests.length) return true
    else return newPasswordCriteria;
}