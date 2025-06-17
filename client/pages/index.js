import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Social Media Manager</h1>
      <Link href="/dashboard" className="text-blue-500 underline">
        Go to Dashboard
      </Link>
    </div>
  );
}
