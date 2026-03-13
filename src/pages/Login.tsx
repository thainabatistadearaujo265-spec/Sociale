import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md text-center z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 gold-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-gold/20">
            <Sparkles className="text-black w-10 h-10" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 gold-text">SocialAI Creator</h1>
        <p className="text-white/60 text-lg mb-12">
          Transforme suas ideias em conteúdo viral com o poder da inteligência artificial.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 px-6 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/90 transition-all active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Entrar com Google
          </button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-white/40">Ou continue com</span>
            </div>
          </div>

          <button className="w-full py-4 px-6 bg-white/5 border border-white/10 text-white font-medium rounded-2xl hover:bg-white/10 transition-all">
            Email
          </button>
          <button className="w-full py-4 px-6 bg-white/5 border border-white/10 text-white font-medium rounded-2xl hover:bg-white/10 transition-all">
            Facebook
          </button>
        </div>

        <p className="mt-12 text-white/40 text-sm">
          Ao entrar, você concorda com nossos <br />
          <span className="text-gold hover:underline cursor-pointer">Termos de Uso</span> e <span className="text-gold hover:underline cursor-pointer">Privacidade</span>.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
