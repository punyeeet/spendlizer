import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert rounded-md"
          src="/logo.jpeg"
          alt="Spendlizer Logo"
          width={360}
          height={74}
          priority
        />
      </div>

      {/* Product Info Section */}
      <div className="relative z-10 w-full max-w-3xl p-6 space-y-6 bg-white rounded-lg shadow-md lg:max-w-4xl dark:bg-neutral-800 dark:text-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Discover Our Product</h2>
        <p className="text-lg leading-relaxed text-center text-gray-600 dark:text-gray-300">
          Spendlizer is your go-to solution for managing expenses with ease and clarity. Whether you're tracking
          personal finances or running a business, our platform helps you stay on top of your spending, set budgets,
          and gain financial insights.
        </p>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Sign up today and start gaining control over your finances!
        </p>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <Link
          href={'/login'}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Login{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Start by logging in.
          </p>
        </Link>
      </div>
    </main>

  );
}
