import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Palette, 
  Briefcase, 
  Dumbbell, 
  Laugh, 
  Zap, 
  Smartphone, 
  Utensils 
} from 'lucide-react';

const niches = [
  { id: 'moda', label: 'Moda', icon: ShoppingBag },
  { id: 'maquiagem', label: 'Maquiagem', icon: Palette },
  { id: 'empreendedorismo', label: 'Empreendedorismo', icon: Briefcase },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'humor', label: 'Humor', icon: Laugh },
  { id: 'motivacao', label: 'Motivação', icon: Zap },
  { id: 'vendas_online', label: 'Vendas Online', icon: Smartphone },
  { id: 'gastronomia', label: 'Gastronomia', icon: Utensils },
];

const NicheSelection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectNiche = async (nicheId: string) => {
    if (!user) return;
    try {
      const userDoc = doc(db, 'users', user.uid);
      await updateDoc(userDoc, { niche: nicheId });
      navigate('/');
    } catch (error) {
      console.error('Error updating niche:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold mb-2 gold-text">Qual é o seu nicho?</h2>
        <p className="text-white/60 mb-12">Escolha o nicho principal do seu perfil para personalizarmos sua IA.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {niches.map((niche) => (
            <button
              key={niche.id}
              onClick={() => handleSelectNiche(niche.id)}
              className="flex flex-col items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-gold/50 hover:bg-gold/5 transition-all group active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <niche.icon className="w-6 h-6 text-white/60 group-hover:text-gold transition-colors" />
              </div>
              <span className="font-medium text-white/80 group-hover:text-white">{niche.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NicheSelection;
