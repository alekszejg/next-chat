import type { Metadata } from "next"
import AuthPage from "../authPage";

export const metadata: Metadata = {
    title: "Register - NextChat"
};


export default function RegistrationPage() {
    return <AuthPage action="login" />;
}