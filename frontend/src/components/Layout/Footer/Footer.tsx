export const Footer = () => {
  return (
    <footer className="bg-slate-800 text-black py-6">
      <div className="container mx-auto px-4 text-center text-sm text-slate-400">
        <p>&copy; {new Date().getFullYear()} jvpires.dev</p>
      </div>
    </footer>
  );
};