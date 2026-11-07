import Link from "next/link";

const linkClassName =
  "text-sm text-slate-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-12">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex rounded-sm text-2xl font-extrabold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
              aria-label="FlyWears home"
            >
              Fly<span className="text-blue-400">Wears</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Discover standout bags, clothing, shoes, and accessories from
              independent sellers.
            </p>
          </div>

          <nav aria-label="Shop">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Shop
            </h2>
            <ul className="mt-4 space-y-3">
              <li><Link href="/shop" className={linkClassName}>All products</Link></li>
              <li><Link href="/collections" className={linkClassName}>Collections</Link></li>
              <li><Link href="/" className={linkClassName}>Categories</Link></li>
            </ul>
          </nav>

          <nav aria-label="Your account">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Your account
            </h2>
            <ul className="mt-4 space-y-3">
              <li><Link href="/sign-in" className={linkClassName}>Sign in</Link></li>
              <li><Link href="/sign-up" className={linkClassName}>Create an account</Link></li>
              <li><Link href="/profile" className={linkClassName}>Profile</Link></li>
            </ul>
          </nav>

          <nav aria-label="For sellers">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              For sellers
            </h2>
            <ul className="mt-4 space-y-3">
              <li><Link href="/sellers" className={linkClassName}>Start selling</Link></li>
              <li><Link href="/seller" className={linkClassName}>Seller dashboard</Link></li>
              <li><Link href="/seller/orders" className={linkClassName}>Manage orders</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 sm:mt-12 sm:flex sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            © FlyWears. All rights reserved.
          </p>
          <Link
            href="/sellers"
            className="mt-4 inline-flex min-h-11 items-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 sm:mt-0"
          >
            Start selling
          </Link>
        </div>
      </div>
    </footer>
  );
}
