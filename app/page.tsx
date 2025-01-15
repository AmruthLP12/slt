// app/auth/page.tsx (or another route)
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

const AuthPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <LoginForm />
      </div>

      <div className="mt-6 w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default AuthPage;
