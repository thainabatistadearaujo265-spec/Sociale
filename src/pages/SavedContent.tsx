import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { handleFirestoreError, OperationType } from '../utils/errorHandlers';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bookmark, 
  Trash2, 
  Copy, 
  Check, 
  FileText, 
  Video, 
  Lightbulb, 
  Calendar, 
  Hash, 
  UserCircle,
  Search
} from 'lucide-react';
import { SavedContent as SavedContentType } from '../types';

const SavedContent: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<SavedContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'saved_content'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedContentType[];
      setItems(data);
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'saved_content'));

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'saved_content', id)).catch(err => handleFirestoreError(err, OperationType.DELETE, `saved_content/${id}`));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'post': return FileText;
      case 'video': return Video;
      case 'idea': return Lightbulb;
      case 'calendar': return Calendar;
      case 'bio': return UserCircle;
      case 'hashtag': return Hash;
      default: return Bookmark;
    }
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold gold-text">Conteúdos Salvos</h1>
        <p className="text-white/40">Acesse e gerencie suas melhores criações.</p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'post', 'video', 'idea', 'calendar', 'bio', 'hashtag'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-gold text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            {f === 'all' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <Bookmark className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">Nenhum conteúdo salvo nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => {
              const Icon = getIcon(item.type);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold capitalize">{item.type}</h3>
                        <p className="text-xs text-white/40">{new Date(item.createdAt?.toDate()).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(item.id!)}
                        className="p-2 text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-2xl p-4 text-sm text-white/80 max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {item.type === 'post' && item.content.caption}
                    {item.type === 'video' && item.content.script}
                    {item.type === 'bio' && item.content.bio}
                    {item.type === 'hashtag' && item.content.hashtags.join(' ')}
                    {item.type === 'idea' && `${item.content.posts.length} ideias geradas`}
                    {item.type === 'calendar' && `${item.content.days.length} dias planejados`}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCopy(JSON.stringify(item.content), item.id!)}
                      className="flex items-center gap-2 text-gold text-sm font-bold"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedId === item.id ? 'Copiado' : 'Copiar Tudo'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SavedContent;
