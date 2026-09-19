export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
      <div className="relative flex items-center justify-center">
        {/* Outer subtle glow spinner */}
        <div className="h-14 w-14 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        {/* Inner dot */}
        <div className="absolute h-3 w-3 rounded-full bg-primary/60 animate-pulse" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="font-mono text-xs text-primary font-medium tracking-wider uppercase">
          Career Compass
        </span>
        <span className="text-xs text-muted-foreground">
          Calibrating trajectory...
        </span>
      </div>
    </div>
  );
}
