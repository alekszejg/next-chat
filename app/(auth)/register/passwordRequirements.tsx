"use client";


export default function PasswordRequirements({ password }: {password: string}) {
    const tests = [
        {status: /[a-z]/.test(password), requirement: 'At least one lower case letter [a-z]'},
        {status: /[A-Z]/.test(password), requirement: 'At least one upper case letter [A-Z]'},
        {status: /[0-9]/.test(password), requirement: 'At least one numeral [0-9]'},
        {status: /[!@#^&*()+_,.{}?-]/.test(password), requirement: 'At least one symbol [!@#^&*()+_,.{}?-]'}
    ]
   
    return (
        <div className="p-4">
            <h3 className="font-bold">Password Requirements:</h3>
            <ul>{tests.map(test => (
                <li key={test.requirement} className={`flex items-center ${test.status ? 'text-green-500' : 'text-red-500'}`}>
                    <span>{test.status ? '✔' : '✘'}</span>
                    <span className="ml-2">{test.requirement}</span>
                </li>
                ))}
            </ul>
        </div>
    );
}

