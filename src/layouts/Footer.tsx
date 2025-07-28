export function Footer() {
  return (
    <footer className="w-full fixed bottom-0 left-0 right-0 bg-[var(--background-alt)] border-t-2 border-blue-500 py-4">
      <div className="container mx-auto px-4">
        <p className="text-[var(--text-muted)] text-sm text-center">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
