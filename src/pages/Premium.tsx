import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Crown, Check, Zap, Star, ShieldCheck } from 'lucide-react';

const Premium: React.FC = () => {
  const { profile } = useAuth();

  const handleUpgrade = async () => {
    if (!profile) return;
    try {
      const userDoc = doc(db, 'users', profile.uid);
      await updateDoc(userDoc, { plan: 'premium' });
      alert('Parabéns! Você agora é um membro Premium.');
    } catch (err) {
      console.error('Upgrade error:', err);
    }
  };

  const features = [
    'Gerações ilimitadas por dia',
    'Ideias virais exclusivas',
    'Calendário de 30 dias',
    'Roteiros de vídeo premium',
    'Suporte prioritário',
    'Acesso antecipado a novas funções'
  ];

  return (
    <div className="space-y-12 pb-20">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full text-gold text-sm font-bold border border-gold/20">
          <Crown className="w-4 h-4" /> PLANOS SOCIALAI
        </div>
        <h1 className="text-4xl md:text-5xl font-bold gold-text">Escolha o seu plano</h1>
        <p className="text-white/40 max-w-xl mx-auto">
          Potencialize seu crescimento nas redes sociais com ferramentas avançadas de IA.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col">
          <h3 className="text-xl font-bold mb-2">Gratuito</h3>
          <div className="text-3xl font-bold mb-6">R$ 0<span className="text-sm text-white/40 font-normal">/mês</span></div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-white/60">
              <Check className="w-5 h-5 text-gold" /> 5 gerações por dia
            </li>
            <li className="flex items-center gap-3 text-white/60">
              <Check className="w-5 h-5 text-gold" /> Calendário de 7 dias
            </li>
            <li className="flex items-center gap-3 text-white/60">
              <Check className="w-5 h-5 text-gold" /> Salvar favoritos
            </li>
          </ul>

          <button 
            disabled 
            className="w-full py-4 bg-white/10 text-white/40 font-bold rounded-xl cursor-not-allowed"
          >
            {profile?.plan === 'free' ? 'Plano Atual' : 'Indisponível'}
          </button>
        </div>

        {/* Premium Plan */}
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="relative bg-white/5 border-2 border-gold rounded-3xl p-8 flex flex-col shadow-2xl shadow-gold/10"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-black text-xs font-bold px-4 py-1 rounded-full">
            MAIS POPULAR
          </div>
          
          <h3 className="text-xl font-bold mb-2 gold-text">Premium</h3>
          <div className="text-3xl font-bold mb-6 gold-text">R$ 49,90<span className="text-sm text-white/40 font-normal">/mês</span></div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-gold" /> {feature}
              </li>
            ))}
          </ul>

          <button 
            onClick={handleUpgrade}
            disabled={profile?.plan === 'premium'}
            className="w-full py-4 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {profile?.plan === 'premium' ? 'Plano Ativo' : 'Assinar Agora'}
          </button>
        </motion.div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/10">
        <div className="flex flex-col items-center text-center gap-3">
          <ShieldCheck className="w-8 h-8 text-gold" />
          <h4 className="font-bold">Seguro</h4>
          <p className="text-xs text-white/40">Pagamento processado com segurança máxima.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-3">
          <Zap className="w-8 h-8 text-gold" />
          <h4 className="font-bold">Instantâneo</h4>
          <p className="text-xs text-white/40">Acesso liberado imediatamente após a confirmação.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-3">
          <Star className="w-8 h-8 text-gold" />
          <h4 className="font-bold">Exclusivo</h4>
          <p className="text-xs text-white/40">Conteúdos gerados com as melhores tendências.</p>
        </div>
      </div>
    </div>
  );
};

export default Premium;
