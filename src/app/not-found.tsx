import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="dark:bg-darkbg min-h-screen">
      <section className="flex flex-col justify-center px-2">
        <div className="flex flex-col items-center my-4">
          <p className="text-7xl text-gray-700 font-bold my-10 dark:text-white">
            404, Oops!
          </p>
          <div className="max-w-lg">
            <Image
              className="rounded"
              src="/images/pagenotfound.png"
              alt="404 Page Not Found"
              width={500}
              height={300}
            />
          </div>
        </div>
        <div className="flex justify-center my-4">
          <Link href="/">
            <button className="w-64 text-xl bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2 text-white">
              Back To Home
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
