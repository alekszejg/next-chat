import { LoaderCircle } from "lucide-react";


export default function Button(props: {text: string, className: string, isLoading: boolean, disabled?: boolean}) {
    const { text, className, isLoading, disabled } = props;
    
    const styling = {
        loader: "mx-auto animate-spin"
    };

    return (
        <button className={className} disabled={disabled || isLoading}>
            {isLoading && <LoaderCircle className={styling.loader} />}
            {!isLoading && text}
        </button>
    );
}