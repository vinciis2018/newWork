import { useTheme } from "../hooks/useTheme";

export function Footer() {
  const {theme} = useTheme();
  return (
    <footer className={`w-full h-16 fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-black' : 'bg-white'} border-t py-4 `}>
      <div className="container mx-auto px-4">
        <p className="text-[var(--text-muted)] text-sm text-center">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
