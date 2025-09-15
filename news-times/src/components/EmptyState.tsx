type EmptyProps = {
  message?: string;
};

export default function EmptyState({ message = "No articles yet." }: EmptyProps) {
  return (
    <div className="text-center text-sm text-black/60 dark:text-white/60 py-16">
      {message}
    </div>
  );
}


