import Link from "next/link";
import Image from "next/image";
import Account from "@/public/images/account.png";

export const Author = ({
  name,
  image,
  slug,
  date,
  end = false,
}: {
  name: string;
  image: string | null;
  slug: string;
  date: Date;
  end?: boolean | undefined;
}) => {
  return (
    <div
      className={`flex gap-3 items-center ${
        end ? "justify-end text-end" : "justify-start text-start"
      }`}
    >
      {!end && (
        <Link href={`/${slug}`} className="w-11 h-11 lg:w-12 lg:h-12 relative">
          <Image
            src={image || Account}
            alt={name}
            fill
            priority={true}
            sizes="(min-width: 768px) 44px"
            className="rounded-full hover:opacity-80 transition-all duration-300"
          />
        </Link>
      )}
      <div className="flex flex-col gap-1 md:gap-0 lg:text-lg">
        <Link href={`/${slug}`}>
          <h3 className="text-white font-medium leading-none tracking-tight line-clamp-1 hover:text-[#EEEEEE]/80 transition-all duration-300">
            {name}
          </h3>
        </Link>
        <h6 className="text-gray-300 leading-none tracking-tight text-sm md:text-base">
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }).format(new Date(date))}
        </h6>
      </div>
      {end && (
        <Link href={`/${slug}`} className="w-11 h-11 lg:w-12 lg:h-12 relative">
          <Image
            src={image || Account}
            alt={name}
            fill
            priority={true}
            sizes="(min-width: 768px) 44px"
            className="rounded-full hover:opacity-80 transition-all duration-300"
          />
        </Link>
      )}
    </div>
  );
};
