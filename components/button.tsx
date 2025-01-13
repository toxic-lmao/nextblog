import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="bg-[#EEEEEE] px-3 py-1 rounded-lg w-max text-black hover:bg-[#EEEEEE]/80 transition-all duration-300"
      {...props}
    >
      {children}
    </button>
  );
}
