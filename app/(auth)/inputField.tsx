import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";
import type { LucideIcon } from "lucide-react";


interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    Icon: LucideIcon, 
    styling: {wrapper: string, input: string, icon: string, error: string}
    error?: FieldError
}

export default forwardRef<HTMLInputElement, InputFieldProps>(
    function Inputfield({ Icon, styling, error, ...otherAttributes }, ref) {
        return (
            <div className={styling.wrapper}>
                {<Icon className={styling.icon} />}
                <input className={styling.input} ref={ref} {...otherAttributes} />
                {error && <p className={styling.error}>{error.message}</p>}
            </div>
        );
    }
);