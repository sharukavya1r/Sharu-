import React, { useState } from 'react';
import { Mail, Phone, Lock, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (profile: { name: string; email: string; phone: string; city: string }) => void;
  showToast: (msg: string) => void;
}

type LoginMode = 'choose' | 'email' | 'mobile' | 'otp';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, showToast }) => {
  const [mode, setMode] = useState<LoginMode>('choose');
  const [emailInput, setEmailInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Google Demo Login
  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const demoProfile = {
        name: 'Google User',
        email: 'user.google@gmail.com',
        phone: '9876543210',
        city: 'Bangalore, Karnataka',
      };
      onLoginSuccess(demoProfile);
      showToast('Successfully logged in with Google!');
    }, 600);
  };

  // 2. Email Demo Login
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const namePart = cleanEmail.split('@')[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const demoProfile = {
        name: formattedName || 'Shopper',
        email: cleanEmail,
        phone: '9876543210',
        city: 'Bangalore, Karnataka',
      };
      onLoginSuccess(demoProfile);
      showToast('Successfully logged in with Email!');
    }, 600);
  };

  // 3. Mobile OTP Login - Step 1: Send OTP
  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobileInput.trim().replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMode('otp');
      showToast('Demo OTP sent: 123456');
    }, 500);
  };

  // 3. Mobile OTP Login - Step 2: Verify OTP
  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() !== '123456') {
      showToast('Invalid demo OTP. Please enter 123456');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const cleanMobile = mobileInput.trim();
      const demoProfile = {
        name: `User ${cleanMobile.slice(-4)}`,
        email: `user_${cleanMobile}@qukebasket.in`,
        phone: cleanMobile,
        city: 'Bangalore, Karnataka',
      };
      onLoginSuccess(demoProfile);
      showToast('Successfully logged in with Mobile OTP!');
    }, 600);
  };

  return (
    <div className="w-full max-w-[390px] min-h-screen sm:h-[844px] bg-white shadow-2xl sm:rounded-[30px] overflow-hidden flex flex-col justify-between relative border-0 sm:border-[8px] sm:border-[#1e293b] select-none font-sans mx-auto">
      {/* Top Banner / Header */}
      <div className="px-6 pt-12 pb-6 text-center bg-gradient-to-b from-orange-50/60 to-white">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#001f3f] text-white shadow-lg mb-4">
          <div className="text-2xl font-black tracking-tighter">
            <span className="text-white">Q</span>
            <span className="text-[#FF8C00]">B</span>
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-[#001f3f] tracking-tight">
          Welcome to <span className="text-[#001f3f]">Quke</span>
          <span className="text-[#FF8C00]">Basket</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1 max-w-[260px] mx-auto">
          Fast online grocery &amp; mobile accessories delivery in minutes.
        </p>
      </div>

      {/* Main Body */}
      <div className="px-6 flex-1 flex flex-col justify-center max-w-[320px] mx-auto w-full pb-8">
        {mode === 'choose' && (
          <div className="space-y-3.5">
            <div className="text-center mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF8C00] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                Demo Authentication
              </span>
              <h2 className="text-sm font-bold text-[#001f3f] mt-2">Sign in to your account</h2>
            </div>

            {/* Google Demo Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-xs font-bold text-[#001f3f] shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.36 7.23 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.5-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.1 0 9.98 0 12s.43 3.9 1.19 5.42l4.09-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.64 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Email Demo Login Button */}
            <button
              type="button"
              onClick={() => setMode('email')}
              disabled={loading}
              className="w-full py-3 px-4 bg-[#001f3f] hover:bg-[#00142b] active:scale-[0.98] transition-all rounded-xl flex items-center justify-center gap-2.5 text-xs font-bold text-white shadow-sm cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#FF8C00]" />
              <span>Continue with Email</span>
            </button>

            {/* Mobile OTP Demo Login Button */}
            <button
              type="button"
              onClick={() => setMode('mobile')}
              disabled={loading}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all border border-gray-200 rounded-xl flex items-center justify-center gap-2.5 text-xs font-bold text-[#001f3f] shadow-sm cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#FF8C00]" />
              <span>Continue with Mobile OTP</span>
            </button>

            <div className="pt-2 text-center">
              <p className="text-[10px] text-gray-400">
                By continuing, you agree to QukeBasket’s Demo Terms &amp; Privacy Policy.
              </p>
            </div>
          </div>
        )}

        {mode === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setMode('choose')}
                className="text-xs font-bold text-gray-500 hover:text-[#001f3f] cursor-pointer"
              >
                ← Back
              </button>
              <span className="text-xs font-bold text-[#001f3f]">Email Sign In</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#001f3f]"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Enter any valid-looking email to sign in instantly.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF8C00] hover:bg-[#e07b00] active:scale-[0.98] transition-all text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {mode === 'mobile' && (
          <form onSubmit={handleMobileSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setMode('choose')}
                className="text-xs font-bold text-gray-500 hover:text-[#001f3f] cursor-pointer"
              >
                ← Back
              </button>
              <span className="text-xs font-bold text-[#001f3f]">Mobile OTP Sign In</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">10-Digit Mobile Number</label>
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">+91</div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#001f3f]"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Enter any 10-digit mobile number. Demo OTP will be 123456.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF8C00] hover:bg-[#e07b00] active:scale-[0.98] transition-all text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Send Demo OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {mode === 'otp' && (
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setMode('mobile')}
                className="text-xs font-bold text-gray-500 hover:text-[#001f3f] cursor-pointer"
              >
                ← Change Number
              </button>
              <span className="text-xs font-bold text-[#001f3f]">Verify OTP</span>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
              <p className="text-[11px] text-gray-700 font-medium">
                Demo OTP sent to <span className="font-bold">+91 {mobileInput}</span>
              </p>
              <p className="text-xs font-extrabold text-[#FF8C00] mt-1">Demo OTP Code: 123456</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Enter 6-Digit OTP</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full pl-9 pr-3 py-2.5 text-sm font-bold tracking-widest border border-gray-200 rounded-xl focus:outline-none focus:border-[#001f3f]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF8C00] hover:bg-[#e07b00] active:scale-[0.98] transition-all text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Verify &amp; Login</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure Demo Frontend Authentication</span>
        </div>
      </div>
    </div>
  );
};
