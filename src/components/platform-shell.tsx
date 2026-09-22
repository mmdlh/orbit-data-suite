import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, BellRing, ChartNoAxesCombined, ChevronDown, Clock3, Gauge, Leaf, Menu, Settings2, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import background from "../assets/datacenter-energy-bg.jpg";

const left = [{ to: "/", label: "监控总览", icon: Gauge }, { to: "/power", label: "动力环境", icon: Zap }, { to: "/security", label: "安防消防", icon: ShieldCheck }] as const;
const right = [{ to: "/alarms", label: "告警管理", icon: BellRing }, { to: "/reports", label: "报表分析", icon: ChartNoAxesCombined }, { to: "/system", label: "系统管理", icon: Settings2 }] as const;

export function PlatformShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: s => s.location.pathname });
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => { const tick=()=>setTime(new Intl.DateTimeFormat("zh-CN",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(new Date())); tick(); const id=setInterval(tick,1000); return()=>clearInterval(id); },[]);
  const nav = (items: typeof left | typeof right) => items.map(item => <Link key={item.to} to={item.to} activeOptions={{exact:item.to==="/"}} className={`nav-link ${path===item.to?"active":""}`}><item.icon/><span>{item.label}</span></Link>);
  return <div className="platform" style={{ "--platform-bg": `url(${background})` } as React.CSSProperties}>
    <div className="background-layer" />
    <nav className="top-nav"><button className="mobile-menu" aria-label="切换菜单" onClick={()=>setOpen(!open)}><Menu/></button><div className={`nav-side nav-left ${open?"open":""}`}>{nav(left)}</div><div className="brand"><div className="brand-mark"><Leaf/><Activity/></div><div><strong>智擎 DCIM</strong><span>数据中心智能运维平台</span></div></div><div className={`nav-side nav-right ${open?"open":""}`}>{nav(right)}</div><div className="system-time"><Clock3/><span>{time}</span><ChevronDown/></div></nav>
    <main className="platform-main">{children}</main><footer><span><i/>系统运行正常</span><span>数据刷新频率 5s</span><span>© 2026 智擎能源科技</span></footer>
  </div>;
}