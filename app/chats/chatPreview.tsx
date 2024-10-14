"use client"

export default function ChatPreview(props: {styling: string, chatID: string}) {
    return (
        <div className={props.styling}>
            {props.chatID}
        </div>
    );
}