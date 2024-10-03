"use server";
import sanitize from "sanitize-html"

export async function sanitizeInput(rawInput: string | string[]) {
    let cleanInput: string | string[]; // array is for form values
  
    if (typeof rawInput === "string") {
        cleanInput = sanitize(rawInput);
    } else {
        cleanInput = rawInput.map(rawString => sanitize(rawString));
    }
    
    return cleanInput;
}

export async function escapeInput(rawInput: string) {
   const replaceKeys: Record<string, string> = {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;"};
   
   const cleanInput = Object.keys(replaceKeys).reduce((acc, key) => {
        const globalMatch = new RegExp(key, 'g'); // Find all occurances of each key
        return acc.replace(globalMatch, replaceKeys[key]); // Accumulates all .replace() changes throughout all iterations
    }, rawInput);
    
    return cleanInput;
}
