'use client';

import { useAuth } from '@/lib/useAuth';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { useLanguage } from '@/lib/LanguageContext';

interface PostForm {
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<PostForm>({
    defaultValues: { published: true }
  });
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [loading, isAdmin, router]);

  const onSubmit = async (data: PostForm) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const dbRef = doc(collection(db, 'posts'));
      await setDoc(dbRef, {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        published: data.published,
        createdAt: serverTimestamp(),
        authorId: user.uid,
        authorName: user.displayName || 'Admin',
      });
      alert(t('admin_required'));
      reset();
      router.push('/');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
      alert(t('admin_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>{t('Loading...')}</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('Write a new post')}</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                {t('Title')}
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  type="text"
                  required
                  {...register('title')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                  placeholder={t('Title placeholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium leading-6 text-gray-900">
                {t('Excerpt')}
              </label>
              <div className="mt-2">
                <textarea
                  id="excerpt"
                  rows={2}
                  {...register('excerpt')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                  placeholder={t('Excerpt placeholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">
                {t('Content (Markdown)')}
              </label>
              <div className="mt-2">
                <textarea
                  id="content"
                  rows={12}
                  required
                  {...register('content')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3 font-mono"
                  placeholder={t('Content placeholder')}
                />
              </div>
            </div>

            <div className="flex items-center gap-x-3">
              <input
                id="published"
                type="checkbox"
                {...register('published')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="published" className="text-sm font-medium leading-6 text-gray-900">
                {t('Publish immediately')}
              </label>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
              >
                {submitting ? t('Publishing...') : t('Publish Post')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
