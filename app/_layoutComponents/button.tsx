import { LoaderCircle } from "lucide-react";

type CustomButton = {
    text: string, 
    className: string, 
    isLoading: boolean, 
    type: "submit" | "button", 
    disabled?: boolean
};

export default function Button(props: CustomButton) {
    const { text, className, isLoading, type, disabled } = props;
    
    const styling = {
        loader: "mx-auto animate-spin"
    };

    return (
        <button className={className} type={type} disabled={disabled || isLoading}>
            {isLoading && <LoaderCircle className={styling.loader} />}
            {!isLoading && text}
        </button>
    );
}