"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import auth from "@/public/images/auth.jpg";
import { useActionState } from "react";
import { githubAuth, credentialsSignup } from "@/actions/handleAuth";
import { Button } from "@/components/button";
import Image from "next/image";
import Link from "next/link";

export default function Signup() {
  const [error, formAction, isPending] = useActionState(
    credentialsSignup,
    null
  );

  return (
    <div className="grid lg:grid-cols-2 h-[80vh]">
      <div className="flex flex-col items-center justify-center gap-4 w-2/3 lg:w-1/2 place-self-center text-nowrap">
        <div className="flex items-center justify-center gap-4 w-full">
          <button className="flex items-center justify-center gap-2 bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold w-full px-3 py-1.5 rounded-xl hover:bg-[#EEEEEE]/80 transition-all duration-300 cursor-pointer">
            <FcGoogle />
            Google
          </button>
          <button
            className="flex items-center justify-center gap-2 bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold w-full px-3 py-1.5 rounded-xl hover:bg-[#EEEEEE]/80 transition-all duration-300 cursor-pointer"
            onClick={() => githubAuth()}
          >
            <FaGithub />
            Github
          </button>
        </div>

        <div className="grid grid-cols-5 place-items-center w-full">
          <hr className="col-span-2 w-full border-gray-500" />
          <h3 className="text-lg font-medium">or</h3>
          <hr className="col-span-2 w-full border-gray-500" />
        </div>

        <form
          action={formAction}
          className="flex flex-col items-center justify-center gap-4 w-full text-gray-200 text-lg font-medium"
        >
          {error && (
            <div
              className="bg-red-800 bg-opacity-50 w-full text-base font-normal text-wrap px-3 py-2 rounded-xl text-center"
              dangerouslySetInnerHTML={{ __html: error }}
            ></div>
          )}

          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              className="w-full py-1.5 px-3 border bg-transparent border-gray-500 rounded-xl focus:outline-hidden"
              id="slug"
              name="slug"
              placeholder="Username"
              required
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <input
              type="file"
              className="hidden"
              id="userImg"
              name="userImg"
              accept="image/*"
              required
            />
            <label
              htmlFor="userImg"
              className="w-full py-2 px-3 text-base border bg-transparent border-gray-500 rounded-xl text-center cursor-pointer hover:bg-gray-500/80 transition-all"
            >
              Select Image
            </label>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <input
              type="email"
              className="w-full py-1.5 px-3 border bg-transparent border-gray-500 rounded-xl focus:outline-hidden"
              id="email"
              name="email"
              placeholder="Email"
              required
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <input
              type="password"
              className="w-full p-1.5 px-3 border bg-transparent border-gray-500 rounded-xl focus:outline-hidden mb-1.5"
              id="password"
              name="password"
              placeholder="Password"
              required
            />
            <input
              type="password"
              className="w-full p-1.5 px-3 border bg-transparent border-gray-500 rounded-xl focus:outline-hidden mb-1.5"
              id="passwordConfirm"
              name="passwordConfirm"
              placeholder="Confirm Password"
              required
            />
          </div>

          <Button
            disabled={isPending}
            className="w-full bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold py-2 rounded-xl cursor-pointer hover:bg-[#EEEEEE]/80 transition-all duration-300"
          >
            {isPending ? "Signing up..." : "Signup"}
          </Button>
        </form>
        <div className="flex flex-col items-center justify-between gap-4 w-full text-gray-200 text-lg font-medium">
          <div className="text-center mt-2">
            <p>
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-[#EEEEEE] underline font-semibold"
              >
                Signin
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-full rounded-tr-none overflow-hidden hidden lg:block relative">
        <Image
          src={auth}
          alt="The adventure begins"
          fill
          quality={100}
          priority={true}
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
