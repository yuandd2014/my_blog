'use client';

import { useAuth } from '@/lib/useAuth';
import Header from '@/components/Header';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import Markdown from 'react-markdown';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  authorName: string;
}

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchPost() {
      if (!params || !params.id) return;
      try {
        const docRef = doc(db, 'posts', params.id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as Post);
        } else {
          setPost(null);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `posts/${params.id}`);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [params]);

  const handleDelete = async () => {
    if (!isAdmin || !post) return;
    if (confirm(t('delete_confirm'))) {
      try {
        await deleteDoc(doc(db, 'posts', post.id));
        alert(t('Post deleted.'));
        router.push('/');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `posts/${post.id}`);
        alert(t('Failed to delete.'));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('Post not found')}</h1>
          <p className="mt-2 text-gray-600">{t('Post not found desc')}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <header className="mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-x-4 text-sm text-gray-500">
                <time dateTime={post.createdAt.toDate().toISOString()}>
                  {format(post.createdAt.toDate(), 'MMMM d, yyyy')}
                </time>
                {post.authorName && (
                  <span className="flex items-center gap-1">
                    {t('By')} {post.authorName}
                  </span>
                )}
              </div>
              {isAdmin && (
                <button
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title={t('Delete Post')}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              {post.title}
            </h1>
          </header>

          <div className="prose prose-blue prose-lg max-w-none text-gray-700">
            <Markdown>{post.content}</Markdown>
          </div>
        </article>
      </main>
    </div>
  );
}
