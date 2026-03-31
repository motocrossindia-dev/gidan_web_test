import type { Metadata } from "next";
import LoginContainer from "@/components/Auth/LoginContainer";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login | Gidan Plants Bangalore",
  description: "Log in to your Gidan account to manage your orders, wishlist, and profile.",
};

export default function LoginPage() {
  return (
    <main className="bg-[#faf9f6] min-h-screen">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[80vh] font-medium text-gray-500">Loading...</div>}>
         <LoginContainer />
      </Suspense>
    </main>
  );
}
