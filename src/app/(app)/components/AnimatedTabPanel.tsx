"use client";

type Panel = {
  key: string | number;
  content: React.ReactNode; // content can be string, JSX, etc.
};

type AnimatedTabPanelProps = {
  panels: Panel[];
  activeIndex: number;
};

export default function AnimatedTabPanel({
  panels,
  activeIndex,
}: AnimatedTabPanelProps) {
  return (
    <div className="relative overflow-hidden min-h-full bg-zinc-100 dark:bg-zinc-900">
      {panels.map((panel, i) => {
        const x = i === activeIndex ? 0 : i < activeIndex ? -100 : 100;
        return (
          <div
            key={panel.key}
            className={`fade-in absolute inset-0 transition-all duration-500 ease-in-out ${
              i === activeIndex ? "overflow-auto" : "overflow-hidden"
            }`}
            style={{
              transform: `translateX(${x}%)`,
              opacity: i === activeIndex ? 1 : 0,
            }}
          >
            {panel.content}
          </div>
        );
      })}
    </div>
  );
}
