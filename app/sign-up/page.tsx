import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            card: "shadow-xl rounded-2xl",
          },
        }}
      />
    </div>
  );
}