'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function TestTheme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Theme Test Page</h1>
      <p>Current theme: {theme}</p>
      
      <div className="space-x-2">
        <Button onClick={() => setTheme('light')}>Light</Button>
        <Button onClick={() => setTheme('dark')}>Dark</Button>
        <Button onClick={() => setTheme('system')}>System</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <Card className="p-4">
          <h2 className="text-lg font-semibold">Card 1</h2>
          <p>This should have dark background in dark mode</p>
        </Card>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Div with classes</h2>
          <p>This should also change in dark mode</p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-900 dark:text-white">This text should be white in dark mode</p>
        <p className="text-gray-600 dark:text-gray-300">This text should be light gray in dark mode</p>
      </div>
    </div>
  );
}