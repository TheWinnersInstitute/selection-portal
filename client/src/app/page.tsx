import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  // redirect("/login");
  return (
    <div className="h-screen flex justify-center items-center text-center font-bold">
      <h1>
        Our main website
        <br />
        <Link
          className="hover:underline text-red-500"
          href="https://www.winnersinstitute.in/"
        >
          www.winnersinstitute.in
        </Link>
      </h1>
    </div>
  );
}
