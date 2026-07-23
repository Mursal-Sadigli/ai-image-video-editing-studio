import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn 
      forceRedirectUrl="/dashboard" 
      appearance={{
        layout: {
          socialButtonsVariant: 'iconButton',
        },
        elements: {
          rootBox: "w-full flex justify-center",
          card: "w-full max-w-sm sm:w-[400px] shadow-xl",
          socialButtons: "flex flex-row justify-between sm:justify-center gap-2",
        }
      }}
    />
  );
}
