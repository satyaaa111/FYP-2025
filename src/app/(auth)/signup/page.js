// src/app/signup/page.jsx
import AuthForm from '@/components/AuthForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="py-5 min-h-screen bg-gradient-to-br from-green-50 gap-1 flex flex-col to-white items-center justify-center">
      {/* <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Agri-Smart</h1>
        <p className="text-gray-600"></p>
      </div> */}
      
      <AuthForm type="signup" className="text-center mx-auto"/>
    </div>
  );
}