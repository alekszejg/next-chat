"use server";
import sanitize from "sanitize-html"


export async function sanitizeInput(rawInput: string[], mode?: string): Promise<(string | undefined)[]> {
    const cleanInput: (string | undefined)[] = rawInput.map(input => sanitize(input));
    return cleanInput;
}

export async function escapeInput(rawInput: string) {
   const replaceKeys: Record<string, string> = {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;"};
   
   const cleanInput = Object.keys(replaceKeys).reduce((acc, key) => {
        const globalMatch = new RegExp(key, 'g'); 
        return acc.replace(globalMatch, replaceKeys[key]); 
    }, rawInput);
    
    return cleanInput;
}

