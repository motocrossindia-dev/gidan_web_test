import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-lg text-gray-600">Page not found</p>
      <Link
        href="/"
        className="px-6 py-3 bg-bio-green text-white rounded-lg hover:opacity-90 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
