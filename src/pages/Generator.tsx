import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { geminiService } from '../services/gemini';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { handleFirestoreError, OperationType } from '../utils/errorHandlers';
import { 
  Sparkles, 
  Copy, 
  Bookmark, 
  Check, 
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ContentType } from '../types';

const Generator: React.FC = () => {
  const { type } = useParams<{ type: ContentType }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const typeLabels: Record<string, string> = {
    post: 'Gerador de Post',
    video: 'Gerador de Vídeo',
    idea: 'Ideias Virais',
    calendar: 'Calendário de Conteúdo',
    bio: 'Gerador de Bio',
    hashtag: 'Gerador de Hashtags',
  };

  const typePlaceholders: Record<string, string> = {
    post: 'Ex: Maquiagem para pele negra, Como investir em ações...',
    video: 'Ex: Dicas de moda para o verão, Receita de bolo de cenoura...',
    idea: 'Clique em gerar para receber tendências do seu nicho',
    calendar: 'Clique em gerar para planejar sua semana',
    bio: 'Ex: Loja de roupas femininas, Consultora de marketing...',
    hashtag: 'Ex: Fitness em casa, Marketing digital para iniciantes...',
  };

  const handleGenerate = async () => {
    if (!profile) return;

    // Check limits
    if (profile.plan === 'free' && profile.dailyUsageCount >= 5) {
      setError('Você atingiu o limite diário de 5 gerações. Mude para o Premium para gerações ilimitadas!');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);

    try {
      let data;
      const niche = profile.niche || 'geral';

      switch (type) {
        case 'post':
          data = await geminiService.generatePost(theme, niche);
          break;
        case 'video':
          data = await geminiService.generateVideoScript(theme, niche, '30s');
          break;
        case 'idea':
          data = await geminiService.generateIdeas(niche);
          break;
        case 'bio':
          data = await geminiService.generateBio(niche, theme);
          break;
        case 'hashtag':
          data = await geminiService.generateHashtags(theme, niche);
          break;
        case 'calendar':
          data = await geminiService.generateCalendar(niche, 7);
          break;
      }

      setResult(data);
      
      // Update usage count
      const userDoc = doc(db, 'users', profile.uid);
      await updateDoc(userDoc, {
        dailyUsageCount: increment(1),
        lastUsageDate: new Date().toISOString().split('T')[0]
      }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `users/${profile.uid}`));

    } catch (err) {
      console.error('Generation error:', err);
      setError('Ocorreu um erro ao gerar o conteúdo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!profile || !result) return;
    try {
      await addDoc(collection(db, 'saved_content'), {
        uid: profile.uid,
        type,
        theme,
        content: result,
        createdAt: new Date()
      }).catch(err => handleFirestoreError(err, OperationType.CREATE, 'saved_content'));
      setSaved(true);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
      </button>

      <header>
        <h1 className="text-3xl font-bold gold-text">{typeLabels[type || 'post']}</h1>
        <p className="text-white/40">Use a IA para criar conteúdo estratégico para o seu perfil.</p>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        {type !== 'idea' && type !== 'calendar' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Sobre o que você quer criar?</label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder={typePlaceholders[type || 'post']}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-all"
            />
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || (type !== 'idea' && type !== 'calendar' && !theme)}
          className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {loading ? 'Gerando...' : 'GERAR CONTEÚDO'}
        </button>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Resultado da IA</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className={`p-3 rounded-xl border transition-all ${saved ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                >
                  {saved ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-8">
              {type === 'post' && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/40">Legenda Viral</span>
                      <button onClick={() => handleCopy(result.caption)} className="text-gold hover:text-gold-light transition-colors">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">{result.caption}</p>
                    <p className="text-gold font-medium">{result.hashtags.join(' ')}</p>
                  </div>
                  <div className="pt-6 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/40">Ideia Visual</span>
                      <button onClick={() => handleCopy(result.visualIdea)} className="text-gold hover:text-gold-light transition-colors">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-white/80">{result.visualIdea}</p>
                  </div>
                </>
              )}

              {type === 'video' && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400">Gancho Viral (Hook)</span>
                    <p className="text-xl font-bold">{result.hook}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">Roteiro Completo</span>
                    <p className="text-white/80 whitespace-pre-wrap">{result.script}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gold">Chamada para Ação (CTA)</span>
                    <p className="font-bold">{result.cta}</p>
                  </div>
                </div>
              )}

              {type === 'idea' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-bold text-blue-400 border-b border-blue-400/20 pb-2">Posts</h3>
                    <ul className="space-y-3">
                      {result.posts.map((idea: string, i: number) => (
                        <li key={i} className="text-sm text-white/70 bg-white/5 p-3 rounded-lg">{idea}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-purple-400 border-b border-purple-400/20 pb-2">Vídeos</h3>
                    <ul className="space-y-3">
                      {result.videos.map((idea: string, i: number) => (
                        <li key={i} className="text-sm text-white/70 bg-white/5 p-3 rounded-lg">{idea}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-yellow-400 border-b border-yellow-400/20 pb-2">Stories</h3>
                    <ul className="space-y-3">
                      {result.stories.map((idea: string, i: number) => (
                        <li key={i} className="text-sm text-white/70 bg-white/5 p-3 rounded-lg">{idea}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {type === 'bio' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">Bio Otimizada</span>
                    <button onClick={() => handleCopy(result.bio)} className="text-gold hover:text-gold-light transition-colors">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xl whitespace-pre-wrap">{result.bio}</p>
                </div>
              )}

              {type === 'hashtag' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">Hashtags Virais</span>
                    <button onClick={() => handleCopy(result.hashtags.join(' '))} className="text-gold hover:text-gold-light transition-colors">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {type === 'calendar' && (
                <div className="space-y-6">
                  {result.days.map((day: any) => (
                    <div key={day.day} className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="w-12 h-12 rounded-xl gold-gradient flex flex-col items-center justify-center text-black">
                        <span className="text-[10px] font-bold uppercase">Dia</span>
                        <span className="text-xl font-bold leading-none">{day.day}</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-bold uppercase text-gold">{day.type}</span>
                        <p className="font-medium">{day.topic}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Generator;
