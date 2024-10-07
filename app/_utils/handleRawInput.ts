import sanitize from "sanitize-html"


export function sanitizeInput(rawInput: string[], mode?: string): (string | undefined)[] {
    const cleanInput: (string | undefined)[] = rawInput.map(input => sanitize(input));
    return cleanInput;
}

export function escapeInput(rawInput: string) {
   const replaceKeys: Record<string, string> = {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;"};
   
   const cleanInput = Object.keys(replaceKeys).reduce((acc, key) => {
        const globalMatch = new RegExp(key, 'g'); 
        return acc.replace(globalMatch, replaceKeys[key]); 
    }, rawInput);
    
    return cleanInput;
}