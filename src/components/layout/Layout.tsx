import Navbar from './Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">P</span>
              </div>
              <span className="font-display text-lg font-semibold text-foreground">PublishMe</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PublishMe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;