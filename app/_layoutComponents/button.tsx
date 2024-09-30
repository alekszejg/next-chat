import { LoaderCircle } from "lucide-react";


export default function Button(props: {text: string, className: string, isLoading: boolean}) {
    const { text, className, isLoading } = props;
    const styling = {
        loader: "mx-auto animate-spin"
    };

    return (
        <button className={className}>
            {isLoading && <LoaderCircle className={styling.loader} />}
            {!isLoading && text}
        </button>
    );
}