import { Logo } from '@/components/icons';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Logo className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-2xl font-bold text-foreground">
            NewsAI Digest
          </h1>
        </div>
      </div>
    </header>
  );
}
