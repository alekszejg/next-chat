"use client";
import type { PasswordRules } from "../register/page";

export default function PasswordChecklist({ criteria }: {criteria: PasswordRules}) {
    return (
        <div className="p-4">
            <h3 className="font-bold">Password Checklist:</h3>
            <ul>
                {criteria.map((item, index) => (
                    <li key={index} className={`flex items-center ${item.status ? 'text-green-500' : 'text-red-500'}`}>
                        <span>{item.status ? '✔' : '✘'}</span>
                        <span className="ml-2">{item.requirement}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
