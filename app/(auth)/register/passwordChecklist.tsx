"use client";
import { useMemo } from "react";
import type { PasswordChecklist } from "./page";

export default function PasswordChecklist({ checklist }: {checklist: PasswordChecklist}) {
    
    const memoizedChecklist = useMemo(() => {
        return checklist.map(rule => (
            <li key={rule.requirement} className={`flex items-center ${rule.status ? 'text-green-500' : 'text-red-500'}`}>
                <span>{rule.status ? '✔' : '✘'}</span>
                <span className="ml-2">{rule.requirement}</span>
            </li>
        ));
    }, [checklist]);
;
    return (
        <div className="p-4">
            <h3 className="font-bold">Password Checklist:</h3>
            <ul>{memoizedChecklist}</ul>
        </div>
    );
}