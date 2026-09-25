export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4 select-none">
      <div className="relative flex items-center justify-center">
        {/* Outer subtle glow spinner */}
        <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        {/* Inner dot */}
        <div className="absolute h-2.5 w-2.5 rounded-full bg-primary animate-ping opacity-75" />
        <div className="absolute h-2 w-2 rounded-full bg-primary" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase">
          Career Compass
        </span>
        <span className="text-xs text-muted-foreground animate-pulse">
          Calibrating trajectory...
        </span>
      </div>
    </div>
  );
}
