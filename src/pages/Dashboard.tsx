import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  FileText, 
  Video, 
  Lightbulb, 
  Calendar, 
  Hash, 
  UserCircle,
  TrendingUp,
  ArrowRight,
  Crown
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();

  const actions = [
    { 
      id: 'post', 
      label: 'Criar Post', 
      desc: 'Legendas e hashtags virais',
      icon: FileText, 
      color: 'bg-blue-500/20 text-blue-400',
      path: '/generate/post'
    },
    { 
      id: 'video', 
      label: 'Criar Vídeo', 
      desc: 'Roteiros para Reels e TikTok',
      icon: Video, 
      color: 'bg-purple-500/20 text-purple-400',
      path: '/generate/video'
    },
    { 
      id: 'ideas', 
      label: 'Ideias Virais', 
      desc: 'Tendências diárias para você',
      icon: Lightbulb, 
      color: 'bg-yellow-500/20 text-yellow-400',
      path: '/generate/idea'
    },
    { 
      id: 'calendar', 
      label: 'Calendário', 
      desc: 'Planejamento de 7 ou 30 dias',
      icon: Calendar, 
      color: 'bg-green-500/20 text-green-400',
      path: '/generate/calendar'
    },
    { 
      id: 'bio', 
      label: 'Bio Otimizada', 
      desc: 'Perfil profissional em segundos',
      icon: UserCircle, 
      color: 'bg-pink-500/20 text-pink-400',
      path: '/generate/bio'
    },
    { 
      id: 'hashtags', 
      label: 'Hashtags', 
      desc: 'Tags estratégicas por nicho',
      icon: Hash, 
      color: 'bg-orange-500/20 text-orange-400',
      path: '/generate/hashtag'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Olá, <span className="gold-text">{profile?.displayName?.split(' ')[0]}</span>!</h1>
          <p className="text-white/40">O que vamos criar hoje para o seu nicho de <span className="text-white/80 capitalize">{profile?.niche}</span>?</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
          <div className="text-right">
            <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Uso Diário</p>
            <p className="text-lg font-bold">{profile?.dailyUsageCount} / {profile?.plan === 'premium' ? '∞' : '5'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <TrendingUp className="text-gold w-5 h-5" />
          </div>
        </div>
      </header>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={action.path}
              className="group block p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-gold/30 hover:bg-white/[0.07] transition-all relative overflow-hidden"
            >
              <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-1">{action.label}</h3>
              <p className="text-white/40 text-sm mb-4">{action.desc}</p>
              <div className="flex items-center text-gold text-sm font-bold group-hover:gap-2 transition-all">
                Começar agora <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Premium Banner */}
      {profile?.plan === 'free' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative p-8 rounded-3xl overflow-hidden gold-gradient"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Crown className="w-32 h-32 text-black" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-black mb-2">Seja Premium</h2>
            <p className="text-black/70 mb-6 max-w-md">Gerações ilimitadas, calendário de 30 dias e ideias exclusivas para o seu negócio decolar.</p>
            <Link
              to="/premium"
              className="inline-block py-3 px-8 bg-black text-white font-bold rounded-xl hover:bg-black/80 transition-all"
            >
              Ver Planos
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
