'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import Link from 'next/link';
import { format } from 'date-fns';
import { useLanguage } from '@/lib/LanguageContext';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  createdAt: Timestamp;
  authorName: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(
          collection(db, 'posts'),
          where('published', '==', true),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedPosts: Post[] = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() } as Post);
        });
        setPosts(fetchedPosts);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'posts');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {t('Thoughts & Writings')}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">{t('No posts yet')}</h3>
            <p className="mt-1 text-gray-500">{t('Check back later')}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <Link href={`/post/${post.id}`} className="absolute inset-0 z-10">
                  <span className="sr-only">View Article</span>
                </Link>
                <div className="flex items-center gap-x-4 text-xs text-gray-500 mb-3">
                  <time dateTime={post.createdAt.toDate().toISOString()}>
                    {format(post.createdAt.toDate(), 'MMMM d, yyyy')}
                  </time>
                  {post.authorName && (
                    <span className="flex items-center gap-1">
                      {t('By')} {post.authorName}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="mt-3 text-gray-600 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                  {t('Read more')}
                  <span aria-hidden="true" className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    &rarr;
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
