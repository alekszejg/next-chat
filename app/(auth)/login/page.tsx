import type { Metadata } from "next"
import AuthPage from "../authPage";

export const metadata: Metadata = {
    title: "Login - NextChat"
};

export type FormInputs = {email: string, password: string};


export default function LoginPage() {
    return <AuthPage action="login" />;
}