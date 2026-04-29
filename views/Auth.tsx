
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Box, User as UserIcon, ShieldCheck, Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
  initialRole?: UserRole;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onBack, initialRole }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(initialRole || UserRole.CUSTOMER);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      onLogin({
        id: Math.random().toString(36).substr(2, 9),
        name: isLogin ? (role === UserRole.ADMIN ? 'Administrator' : 'Valued Customer') : name,
        email: email,
        role: role
      });
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      <div className="absolute top-8 left-8 z-20">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors group"
        >
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 group-hover:bg-indigo-50 transition-colors">
            <ArrowRight size={18} className="rotate-180" />
          </div>
          Back to Landing
        </button>
      </div>

      {/* Dynamic Background Elements */}
      <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[80px] animate-float"></div>
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-violet-200/40 rounded-full mix-blend-multiply filter blur-[80px] animate-float" style={{animationDelay: '2s'}}></div>

      <div className="w-full max-w-md z-10 animate-scale-in">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-2xl shadow-indigo-200 mb-6 ring-8 ring-indigo-50">
            <Box size={36} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
            RentFlow <Sparkles className="text-amber-400 fill-amber-400" size={24} />
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Enterprise Rental Management</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl shadow-slate-200 p-10 border border-white/50">
          {/* Role Selection Tabs */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-10 relative">
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[48%] bg-white rounded-xl shadow-md transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${role === UserRole.ADMIN ? 'left-[50.5%]' : 'left-1.5'}`}
            ></div>
            <button 
              type="button"
              onClick={() => setRole(UserRole.CUSTOMER)}
              className={`flex-1 relative z-10 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-300 ${role === UserRole.CUSTOMER ? 'text-indigo-600' : 'text-slate-500'}`}
            >
              <UserIcon size={18} /> Customer
            </button>
            <button 
              type="button"
              onClick={() => setRole(UserRole.ADMIN)}
              className={`flex-1 relative z-10 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-300 ${role === UserRole.ADMIN ? 'text-indigo-600' : 'text-slate-500'}`}
            >
              <ShieldCheck size={18} /> Admin
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {isLogin ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {isLogin ? `Log in to your ${role.toLowerCase()} account.` : `Create your new ${role.toLowerCase()} profile.`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. John Doe" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
                  />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 transform active:scale-[0.98] transition-all mt-10 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <>
                  <span className="text-lg">{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
            >
              {isLogin ? "New to RentFlow? Create account" : "Already registered? Log in here"}
            </button>
          </div>
        </div>
        
        <p className="text-center mt-12 text-xs text-slate-400 font-bold uppercase tracking-widest">
          &copy; 2024 RentFlow Global Systems
        </p>
      </div>
    </div>
  );
};
