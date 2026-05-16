'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface Translations {
  [key: string]: {
    en: string;
    zh: string;
  };
}

const translations: Translations = {
  // Header
  "Personal Blog": { en: "Personal Blog", zh: "个人博客" },
  "Write": { en: "Write", zh: "写文章" },
  "Logout": { en: "Logout", zh: "退出登录" },
  "Login": { en: "Login", zh: "登录" },
  
  // Home
  "Thoughts & Writings": { en: "Thoughts & Writings", zh: "思考与文字" },
  "subtitle": { 
    en: "A personal space for ideas, technical explorations, and stories.", 
    zh: "一个用于分享想法、技术探索和故事的个人空间。" 
  },
  "No posts yet": { en: "No posts yet", zh: "暂无文章" },
  "Check back later": { en: "Check back later for new content.", zh: "请稍后访问以获取新内容。" },
  "By": { en: "By", zh: "作者" },
  "Read more": { en: "Read more", zh: "阅读更多" },
  
  // Admin
  "Write a new post": { en: "Write a new post", zh: "撰写新文章" },
  "Title": { en: "Title", zh: "标题" },
  "Title placeholder": { en: "Enter a captivating title", zh: "输入一个吸引人的标题" },
  "Excerpt": { en: "Excerpt", zh: "摘要" },
  "Excerpt placeholder": { en: "A short summary of the post...", zh: "文章的简短摘要..." },
  "Content (Markdown)": { en: "Content (Markdown)", zh: "内容 (Markdown格式)" },
  "Content placeholder": { en: "Write your post content using Markdown...", zh: "使用Markdown编写您的文章内容..." },
  "Publish immediately": { en: "Publish immediately", zh: "立即发布" },
  "Publishing...": { en: "Publishing...", zh: "发布中..." },
  "Publish Post": { en: "Publish Post", zh: "发布文章" },
  
  // Post
  "Post not found": { en: "Post not found", zh: "文章未找到" },
  "Post not found desc": { en: "The post you are looking for does not exist or has been removed.", zh: "您正在寻找的文章不存在或已被删除。" },
  "Delete Post": { en: "Delete Post", zh: "删除文章" },
  "delete_confirm": { en: "Are you sure you want to delete this post?", zh: "您确定要删除这篇文章吗？" },
  "Post deleted.": { en: "Post deleted.", zh: "文章已删除。" },
  "Failed to delete.": { en: "Failed to delete.", zh: "删除失败。" },
  "Loading...": { en: "Loading...", zh: "加载中..." },
  "admin_required": { en: "Post created successfully!", zh: "文章创建成功！" },
  "admin_failed": { en: "Failed to create post. Check console for details.", zh: "创建文章失败。请检查控制台了解详情。" },
  "Login failed": { en: "Login failed", zh: "登录失败" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
