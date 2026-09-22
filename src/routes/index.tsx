import { createFileRoute } from "@tanstack/react-router";
import { OverviewPage } from "../components/platform-ui";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "监控总览 — 智擎 DCIM" }, { name: "description", content: "数据中心机房全景、实时告警、PUE 与设备状态总览。" },
    { property: "og:title", content: "监控总览 — 智擎 DCIM" }, { property: "og:description", content: "数据中心实时运行态势总览。" },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: OverviewPage,
});
