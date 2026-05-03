import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-warm-gray">
        Page not found
      </p>
      <h1 className="mt-4 font-serif text-6xl text-charcoal sm:text-8xl">
        404
      </h1>
      <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <p className="mt-6 max-w-md font-serif text-lg italic text-charcoal-light">
        It looks like this page wandered off. Let&apos;s get you back to the
        celebration.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back to Home
      </Link>
    </div>
  );
}
