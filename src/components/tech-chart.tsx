import { useEffect, useRef } from "react";
import type { EChartsOption } from "echarts";

export function TechChart({ option, className = "h-64" }: { option: EChartsOption; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chart: import("echarts").ECharts | undefined;
    let disposed = false;
    const resize = () => chart?.resize();
    void import("echarts").then((echarts) => {
      if (disposed || !ref.current) return;
      chart = echarts.init(ref.current);
      chart.setOption(option, true);
      window.addEventListener("resize", resize);
    });
    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      chart?.dispose();
    };
  }, [option]);

  return <div ref={ref} className={className} aria-label="数据图表" />;
}