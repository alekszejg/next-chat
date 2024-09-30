import type { Metadata } from "next"
import AuthPage from "../authPage";

export const metadata: Metadata = {
    title: "Login - NextChat"
};


export default function LoginPage() {
    return <AuthPage action="login" />;
}