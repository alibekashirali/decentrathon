import { ReactNode } from 'react';
import './globals.css'; // Import your global styles
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Home, BookOpen } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sequence Learning</title>
      </head>
      <body className="min-h-screen bg-background flex flex-col">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Sequence Learning</h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/">
                    <Button variant="ghost">
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Button>
                  </Link>
                </li>
                {/* <li>
                  <Link href="/learn">
                    <Button variant="ghost">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Learn
                    </Button>
                  </Link>
                </li> */}
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
            © 2024 Sequence Learning. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
