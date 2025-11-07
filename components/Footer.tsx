export default function Footer(){
  return (
    <footer className="mt-12 border-t border-black/5 dark:border-white/10">
      <div className="container py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Ops Protocol Tools • Bridge Theory & Co-Parenting Systems
      </div>
    </footer>
  );
}
