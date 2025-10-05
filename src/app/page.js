// import Image from "next/image";
"use client";
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/dashboard'); // Replace with your target path
  };
  return (
    <ProtectedRoute>
      <div className='text-3xl font-bold p-4 flex flex-col gap-5 justify-center items-center min-h-screen'>
        <div className="">
          Hola! Welcome to Agri-Smart
        </div>
        <button
          onClick={handleRedirect}
          className="dark:bg-green-600 hover:bg-green-700 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
        >
          Go to Dashboard
        </button>
      </div>
    </ProtectedRoute>
  );
}
