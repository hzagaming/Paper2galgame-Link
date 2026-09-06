# v2.8.4：主标题显示与全输入滚动稳定性修复

发布日期：2026-09-06

本次补丁修正宽屏主标题比例，并补齐纯触屏、混合输入与输入能力动态切换时的原生纵向滚动路径，在保留现有切片、卡片、粒子与主视觉动画的同时消除偶发滑动停滞。

## 更新内容

- 主标题改为依据左侧内容栏宽度缩放，不再按整个视口无限放大；降低宽屏上限并放松字距、行距，让 `Paper / to / Galgame.` 与右侧主视觉保持清晰层级。
- 保留手机端字号、三段标题切片和 reduced-motion 降级路径，避免标题修正影响窄屏布局与无障碍偏好。
- 所有具有粗指针能力的设备统一使用无几何位移的淡入动画，覆盖触屏电脑、外接鼠标平板和部分 WebView 的混合输入分支。
- 页面明确启用原生纵向 `pan-y` 并保留 `pinch-zoom`，连续上下反向滑动不再受到触摸反馈动画竞争。
- 修复横向裁切创建额外滚动容器导致的吸顶栏失效，并恢复页面上下边界的自然滚动反馈。
- 移除 CTA 锚点的双重顶部偏移，跳转后章节标题稳定落在吸顶导航下方。
- 复验 320–1688px 宽度、横竖屏、开场多个时间点、连续反向滑动与运行中输入能力切换，未发现横向溢出或控制台错误。

上一版本内容已移入 [v2.8.3 历史公告](docs/announcements/history/v2.8.3.md)，更早版本见 [v2.8.2](docs/announcements/history/v2.8.2.md)、[v2.8.1](docs/announcements/history/v2.8.1.md)、[v2.8.0](docs/announcements/history/v2.8.0.md)、[v2.7.0](docs/announcements/history/v2.7.0.md)、[v2.6.0](docs/announcements/history/v2.6.0.md)、[v2.5.0](docs/announcements/history/v2.5.0.md)、[v2.4.0](docs/announcements/history/v2.4.0.md)、[v2.3.0](docs/announcements/history/v2.3.0.md)、[v2.2.0](docs/announcements/history/v2.2.0.md)、[v2.1.0](docs/announcements/history/v2.1.0.md) 与 [v2.0.0](docs/announcements/history/v2.0.0.md) 历史公告。
