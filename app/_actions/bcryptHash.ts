"use server";
import bcrypt from 'bcryptjs';

// Hash password
export async function hashPassword(password: string, saltRounds: number = 10) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}


// Compare string input with hashed value
export async function comparePasswordHash(stringPassword: string, hashedPassword: string) {
    const isMatch = bcrypt.compare(stringPassword, hashedPassword);
    return isMatch;
}

