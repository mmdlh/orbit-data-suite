import { useMemo, useState, type ReactNode } from "react";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BatteryCharging,
  BellRing, Camera, ChevronRight, CircleGauge, Clock3,
  CloudLightning, Cpu, Database, DoorOpen, Droplets, Fan, FileChartColumn,
  Flame, Gauge, HardDrive, History, KeyRound, LocateFixed,
  Network, Radio, RefreshCw, Search, Server, Settings2, ShieldCheck,
  Snowflake, Thermometer, Users, Zap,
} from "lucide-react";
import type { EChartsOption } from "echarts";
import { TechChart } from "./tech-chart";
import { Button } from "./ui/button";

const palette: string[] = ["#2df4c0", "#32b8ff", "#ffd166", "#ff5578", "#7c8cff"];
const axis = { axisLine: { lineStyle: { color: "rgba(142,190,211,.22)" } }, axisLabel: { color: "#7fa6b7" }, splitLine: { lineStyle: { color: "rgba(142,190,211,.08)" } } };
const tooltip = { trigger: "axis" as const, backgroundColor: "rgba(5,19,29,.94)", borderColor: "rgba(45,244,192,.35)", textStyle: { color: "#dff9f2" } };

export function PageHead({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return <header className="page-head"><div><div className="eyebrow"><span className="live-dot" />{eyebrow}</div><h1>{title}</h1><p>{description}</p></div><div className="page-actions">{actions ?? <><Button variant="outline" size="sm"><RefreshCw />刷新</Button><Button size="sm"><FileChartColumn />导出数据</Button></>}</div></header>;
}

export function Glass({ title, subtitle, icon, className = "", children, action }: { title?: string; subtitle?: string; icon?: ReactNode; className?: string; children: ReactNode; action?: ReactNode }) {
  return <section className={`glass-card ${className}`}><div className="card-glow" />{title && <div className="card-head"><div className="card-title-wrap"><span className="card-icon">{icon}</span><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div>{action}</div>}{children}</section>;
}

export function Stat({ label, value, unit, trend, icon, tone = "green" }: { label: string; value: string; unit?: string; trend?: string; icon: ReactNode; tone?: "green" | "blue" | "amber" | "red" }) {
  const down = trend?.startsWith("-");
  return <div className={`stat-card tone-${tone}`}><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><div className="stat-value">{value}<small>{unit}</small></div>{trend && <div className={`stat-trend ${down ? "down" : "up"}`}>{down ? <ArrowDownRight /> : <ArrowUpRight />}{trend} <span>较昨日</span></div>}</div>;
}

export function StatusPill({ tone = "ok", children }: { tone?: "ok" | "warn" | "danger" | "info"; children: ReactNode }) {
  return <span className={`status-pill status-${tone}`}><i />{children}</span>;
}

function Chart({ type, className = "h-64" }: { type: "energy" | "pie" | "bar" | "radar" | "temp" | "alarm" | "pue"; className?: string }) {
  const option = useMemo((): EChartsOption => {
    if (type === "pie") return { color: palette, tooltip: { trigger: "item" }, legend: { bottom: 0, textStyle: { color: "#8eb0c1" }, icon: "circle" }, series: [{ type: "pie", radius: ["48%", "72%"], center: ["50%", "43%"], itemStyle: { borderColor: "#071923", borderWidth: 3 }, label: { color: "#dff9f2", formatter: "{d}%" }, data: [{ value: 42, name: "IT设备" }, { value: 28, name: "制冷" }, { value: 18, name: "配电" }, { value: 12, name: "其他" }] }] };
    if (type === "radar") return { color: palette, radar: { indicator: [{ name: "UPS", max: 100 }, { name: "配电", max: 100 }, { name: "制冷", max: 100 }, { name: "环境", max: 100 }, { name: "安防", max: 100 }], splitNumber: 4, axisName: { color: "#91b7c8" }, splitLine: { lineStyle: { color: "rgba(75,210,190,.18)" } }, splitArea: { areaStyle: { color: ["rgba(9,39,50,.28)", "rgba(8,24,35,.08)"] } }, axisLine: { lineStyle: { color: "rgba(75,210,190,.22)" } } }, series: [{ type: "radar", symbol: "circle", symbolSize: 5, lineStyle: { width: 2 }, areaStyle: { opacity: .22 }, data: [{ value: [96, 92, 88, 95, 91], name: "健康度" }] }] };
    if (type === "bar" || type === "alarm") return { color: type === "alarm" ? ["#ff5578", "#ffd166", "#32b8ff"] : ["#2df4c0", "#32b8ff"], tooltip, legend: { top: 8, right: 12, textStyle: { color: "#8eb0c1" } }, grid: { left: 42, right: 20, top: 48, bottom: 28 }, xAxis: { type: "category", data: type === "alarm" ? ["动力", "环境", "安防", "消防", "通讯", "其他"] : ["A区", "B区", "C区", "D区", "E区"], ...axis }, yAxis: { type: "value", ...axis }, series: type === "alarm" ? [{ name: "严重", type: "bar", stack: "x", data: [5, 2, 1, 0, 3, 1], barWidth: 16 }, { name: "一般", type: "bar", stack: "x", data: [12, 9, 4, 2, 7, 3] }] : [{ name: "今日", type: "bar", data: [328, 295, 346, 267, 301], barWidth: 12, itemStyle: { borderRadius: [3, 3, 0, 0] } }, { name: "昨日", type: "bar", data: [302, 281, 319, 277, 288], barWidth: 12, itemStyle: { borderRadius: [3, 3, 0, 0] } }] };
    const times = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"];
    const configs = type === "temp" ? { names: ["温度", "湿度"], a: [21.8, 21.6, 22.4, 23.1, 22.7, 22.2, 21.9], b: [48, 49, 47, 45, 46, 48, 49] } : type === "pue" ? { names: ["PUE", "目标线"], a: [1.38, 1.35, 1.33, 1.31, 1.29, 1.28, 1.30], b: [1.32, 1.32, 1.32, 1.32, 1.32, 1.32, 1.32] } : { names: ["总能耗", "IT负载"], a: [610, 580, 720, 840, 790, 730, 650], b: [420, 408, 505, 578, 548, 510, 452] };
    return { color: palette, tooltip, legend: { top: 8, right: 12, textStyle: { color: "#8eb0c1" }, icon: "roundRect" }, grid: { left: 44, right: 24, top: 52, bottom: 28 }, xAxis: { type: "category", boundaryGap: false, data: times, ...axis }, yAxis: { type: "value", ...axis }, series: [{ name: configs.names[0], type: "line", smooth: true, symbol: "none", data: configs.a, lineStyle: { width: 3 }, areaStyle: { opacity: .13 } }, { name: configs.names[1], type: "line", smooth: true, symbol: "none", data: configs.b, lineStyle: { width: 2, type: type === "pue" ? "dashed" : "solid" } }] };
  }, [type]);
  return <TechChart option={option} className={className} />;
}

const alarms = [
  ["ALM-092201", "UPS-2 电池组电压偏低", "动力系统", "10:18:32", "严重"],
  ["ALM-092198", "A区冷通道温度偏高", "环境系统", "10:12:08", "一般"],
  ["ALM-092191", "3号门禁异常开启", "安防系统", "09:57:41", "提示"],
  ["ALM-092187", "精密空调 03 通讯中断", "制冷系统", "09:46:20", "严重"],
];

function AlarmTable({ full = false }: { full?: boolean }) {
  const rows = full ? [...alarms, ["ALM-092180", "B区漏水绳状态异常", "环境系统", "09:31:05", "一般"], ["ALM-092173", "烟感探测器离线", "消防系统", "09:18:27", "提示"]] : alarms;
  return <div className="table-wrap"><table><thead><tr><th>告警编号</th><th>告警内容</th><th>系统</th><th>发生时间</th><th>级别</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}><td className="mono">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td><StatusPill tone={row[4] === "严重" ? "danger" : row[4] === "一般" ? "warn" : "info"}>{row[4]}</StatusPill></td></tr>)}</tbody></table></div>;
}

export function OverviewPage() {
  return <><PageHead eyebrow="全域在线 · 数据延迟 32ms" title="监控总览" description="华东核心数据中心 · 实时运行态势" />
    <div className="stats-grid"><Stat label="实时负载" value="1,842" unit="kW" trend="+2.8%" icon={<Zap />} /><Stat label="实时 PUE" value="1.28" trend="-3.2%" icon={<Gauge />} tone="blue" /><Stat label="在线设备" value="2,486" unit="台" trend="+0.4%" icon={<Server />} /><Stat label="未恢复告警" value="12" unit="条" trend="-18%" icon={<BellRing />} tone="amber" /></div>
    <div className="overview-grid"><Glass title="机房全景" subtitle="核心区 A / B / C · 3D 运行态势" icon={<LocateFixed />} className="panorama"><div className="room-scene"><div className="scene-label"><Radio /> 实时拓扑</div>{["A区 · 98%", "B区 · 96%", "C区 · 94%"].map((x, i) => <div key={x} className={`rack rack-${i + 1}`}><span>{x}</span><i /><i /><i /><i /><i /></div>)}<div className="floor-grid" /></div></Glass><Glass title="PUE 实时趋势" subtitle="过去 24 小时" icon={<Activity />}><Chart type="pue" /></Glass><Glass title="设备状态汇总" subtitle="2,486 台已接入" icon={<Cpu />}><Chart type="pie" /></Glass><Glass title="实时告警" subtitle="当前 12 条未恢复" icon={<AlertTriangle />} className="wide"><AlarmTable /></Glass></div></>;
}

const devices = [{ n: "UPS-01", t: "UPS", v: "负载 68%", s: "正常", i: <BatteryCharging /> }, { n: "精密空调-03", t: "制冷", v: "送风 18.6°C", s: "告警", i: <Snowflake /> }, { n: "低压配电柜-A", t: "配电", v: "功率 486kW", s: "正常", i: <Zap /> }, { n: "温湿度-A12", t: "环境", v: "22.4°C / 47%", s: "正常", i: <Thermometer /> }, { n: "漏水控制器-B", t: "环境", v: "回路正常", s: "正常", i: <Droplets /> }, { n: "新风机组-02", t: "制冷", v: "风量 82%", s: "维护", i: <Fan /> }];

export function PowerPage() {
  const [filter, setFilter] = useState("全部");
  return <><PageHead eyebrow="动力环境 · 2,142 测点" title="动力环境" description="供配电、制冷与环境参数一体化监测" actions={<div className="segmented">{["全部", "动力", "环境"].map(x => <button key={x} className={filter === x ? "active" : ""} onClick={() => setFilter(x)}>{x}</button>)}</div>} />
    <div className="power-layout"><aside className="system-tree glass-card"><h2>设备分组</h2>{[{Icon:Zap,n:"供配电系统",c:"186"},{Icon:BatteryCharging,n:"UPS系统",c:"24"},{Icon:Snowflake,n:"精密空调",c:"48"},{Icon:Thermometer,n:"温湿度",c:"326"},{Icon:Droplets,n:"漏水检测",c:"64"}].map(({Icon,n,c}) => <div className="tree-row" key={n}><Icon /><span>{n}</span><b>{c}</b><ChevronRight /></div>)}</aside><div className="power-main"><div className="mini-stats"><Stat label="总有功功率" value="1.84" unit="MW" icon={<CloudLightning />} /><Stat label="平均温度" value="22.4" unit="°C" icon={<Thermometer />} tone="blue" /><Stat label="制冷负载" value="73" unit="%" icon={<Snowflake />} tone="blue" /></div><Glass title="动力负载与能耗趋势" subtitle="今日分时数据" icon={<Activity />}><Chart type="energy" className="h-72" /></Glass></div></div>
    <Glass title="设备实时状态" subtitle="关键设备与实时遥测" icon={<Server />} className="mt-4"><div className="device-grid">{devices.filter(d => filter === "全部" || (filter === "动力" ? ["UPS","配电"].includes(d.t) : !["UPS","配电"].includes(d.t))).map(d => <div className="device-card" key={d.n}><span className="device-icon">{d.i}</span><div><h3>{d.n}</h3><p>{d.t} · {d.v}</p></div><StatusPill tone={d.s === "告警" ? "danger" : d.s === "维护" ? "warn" : "ok"}>{d.s}</StatusPill></div>)}</div></Glass></>;
}

export function SecurityPage() {
  return <><PageHead eyebrow="安防态势 · 布防中" title="安防消防" description="视频、门禁、消防与周界联动监管" />
    <div className="security-strip">{[{Icon:Camera,n:"摄像机",v:"126 / 128"},{Icon:DoorOpen,n:"门禁控制器",v:"32 / 32"},{Icon:Flame,n:"消防回路",v:"18 / 18"},{Icon:ShieldCheck,n:"布防区域",v:"12 / 12"}].map(({Icon,n,v},i)=><div className="security-kpi" key={n}><Icon/><span>{n}<b>{v}</b></span><StatusPill tone={i===0?"warn":"ok"}>{i===0?"2 离线":"正常"}</StatusPill></div>)}</div>
    <div className="security-grid"><Glass title="视频监控" subtitle="核心机房实时画面 · 4 分屏" icon={<Camera />} className="camera-panel"><div className="camera-grid">{["A区主通道","B区冷通道","配电室","园区北门"].map((x,i)=><div className={`camera-feed feed-${i}`} key={x}><div className="scanline"/><span><i/> LIVE · {x}</span><em>2026-09-22 10:{23-i}:08</em></div>)}</div></Glass><Glass title="消防分区状态" subtitle="今日 0 起火情" icon={<Flame />}><div className="zone-map">{["A1","A2","B1","B2","配电","电池"].map((z,i)=><div className={i===4?"zone warning":"zone"} key={z}><Flame/><b>{z}</b><small>{i===4?"预警复核":"正常"}</small></div>)}</div></Glass><Glass title="今日安防事件" subtitle="门禁与入侵记录" icon={<History />}><div className="timeline">{[["10:12","运维人员进入 A 区","正常"],["09:48","北门访客授权通过","正常"],["08:36","3号门异常开启","复核中"],["07:55","夜间巡检完成","正常"]].map(x=><div className="timeline-row" key={x[0]}><time>{x[0]}</time><i/><span>{x[1]}</span><StatusPill tone={x[2]==="复核中"?"warn":"ok"}>{x[2]}</StatusPill></div>)}</div></Glass></div></>;
}

export function AlarmPage() {
  const [tab,setTab]=useState("实时告警");
  return <><PageHead eyebrow="告警中心 · 声光联动开启" title="告警管理" description="从发现、确认到闭环的全流程处置" actions={<Button size="sm"><BellRing/>推送配置</Button>} />
    <div className="alarm-hero"><div><AlertTriangle/><span>当前告警</span><strong>12</strong><small>严重 4 · 一般 6 · 提示 2</small></div><div className="alarm-ring"><span>闭环率<strong>96.8%</strong></span></div><div className="alarm-metrics"><p>平均确认时间 <b>2m 18s</b></p><p>平均恢复时间 <b>18m 42s</b></p><p>今日已关闭 <b>47 条</b></p></div></div>
    <div className="tabs-row">{["实时告警","告警历史","告警策略","推送配置"].map(x=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}>{x}</button>)}</div>
    <div className="alarm-grid"><Glass title={tab} subtitle="按等级与发生时间排序" icon={<BellRing />} className="wide"><div className="filter-row"><div className="search"><Search/><input aria-label="搜索告警" placeholder="搜索告警内容或设备"/></div><Button variant="outline" size="sm"><Settings2/>筛选</Button></div><AlarmTable full /></Glass><Glass title="告警类型分布" subtitle="过去 24 小时" icon={<Activity />}><Chart type="alarm" className="h-72"/></Glass></div></>;
}

export function ReportsPage() {
  return <><PageHead eyebrow="数据洞察 · 统计周期 本月" title="报表分析" description="能效、运行质量与故障趋势深度分析" actions={<><div className="date-chip"><Clock3/>2026-09-01 — 09-22</div><Button size="sm"><FileChartColumn/>生成报表</Button></>} />
    <div className="report-banner"><div><span>本月累计能耗</span><strong>982,640 <small>kWh</small></strong><em><ArrowDownRight/> 同比下降 6.8%</em></div><div className="energy-bars">{[42,58,71,65,80,74,88,76,92,84,96,87].map((x,i)=><i key={i} style={{height:`${x}%`}}/>)}</div><div><span>节能收益估算</span><strong>¥ 86,420</strong><small>相当于减少 68.2t CO₂ 排放</small></div></div>
    <div className="reports-grid"><Glass title="能耗趋势" subtitle="总能耗 / IT 负载" icon={<Zap />} className="double"><Chart type="energy" className="h-72"/></Glass><Glass title="能耗构成" subtitle="本月累计" icon={<CircleGauge />}><Chart type="pie" className="h-72"/></Glass><Glass title="分区能耗对比" subtitle="今日 vs 昨日" icon={<FileChartColumn />}><Chart type="bar"/></Glass><Glass title="系统健康雷达" subtitle="综合评分 92.4" icon={<Activity />}><Chart type="radar"/></Glass><Glass title="PUE 月度分析" subtitle="目标值 1.32" icon={<Gauge />}><Chart type="pue"/></Glass></div></>;
}

export function SystemPage() {
  const rows=[{name:"核心交换机-01",type:"网络设备",code:"NET-SW-001",room:"A区 01列",status:"在用"},{name:"UPS主机-02",type:"动力设备",code:"PWR-UPS-002",room:"配电室",status:"在用"},{name:"精密空调-03",type:"制冷设备",code:"HVAC-AC-003",room:"B区北侧",status:"维护"},{name:"采集网关-12",type:"采集设备",code:"IOT-GW-012",room:"C区 04列",status:"在用"}];
  return <><PageHead eyebrow="系统运维 · 最近同步 10:22:48" title="系统管理" description="资产、用户、采集与审计集中配置" actions={<Button size="sm"><Settings2/>系统配置</Button>} />
    <div className="admin-grid"><aside className="admin-menu glass-card">{[{Icon:Users,n:"用户权限",c:"128 用户"},{Icon:HardDrive,n:"资产台账",c:"2,486 资产"},{Icon:Network,n:"采集配置",c:"36 网关"},{Icon:History,n:"操作日志",c:"今日 184 条"},{Icon:KeyRound,n:"安全策略",c:"7 项策略"}].map(({Icon,n,c},i)=><button className={i===1?"active":""} key={n}><Icon/><span>{n}<small>{c}</small></span><ChevronRight/></button>)}</aside><div className="admin-main"><div className="mini-stats"><Stat label="资产总数" value="2,486" unit="项" icon={<Database/>}/><Stat label="本月新增" value="32" unit="项" icon={<HardDrive/>} tone="blue"/><Stat label="临近维保" value="18" unit="项" icon={<Clock3/>} tone="amber"/></div><Glass title="资产台账" subtitle="全生命周期设备档案" icon={<Database />} action={<Button size="sm">新增资产</Button>}><div className="filter-row"><div className="search"><Search/><input aria-label="搜索资产" placeholder="搜索资产名称或编号"/></div><StatusPill>数据已同步</StatusPill></div><div className="table-wrap"><table><thead><tr><th>资产名称</th><th>类型</th><th>资产编号</th><th>位置</th><th>状态</th></tr></thead><tbody>{rows.map(r=><tr key={r.code}><td><b>{r.name}</b></td><td>{r.type}</td><td className="mono">{r.code}</td><td>{r.room}</td><td><StatusPill tone={r.status==="维护"?"warn":"ok"}>{r.status}</StatusPill></td></tr>)}</tbody></table></div></Glass></div></div></>;
}