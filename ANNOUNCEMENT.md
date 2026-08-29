# v2.8.3：全平台触觉动效与音频恢复稳定性升级

发布日期：2026-08-30

本次补丁围绕桌面、手机、平板和混合输入设备完成 UI、UX、动画、SFX 与 BGM 深度审查，强化触摸反馈、移动性能和动态偏好适配，并修复系统关闭或自动挂起 AudioContext 时的恢复竞态。

## 更新内容

- 新增移动端触摸轨迹、按压能量环、卡片分层姿态与松手余波，主视觉也会响应主触点，并在多指交互中保持稳定。
- 触摸高频事件统一经 requestAnimationFrame 合帧；手机 Canvas 使用独立粒子、能量环和 DPR 上限，兼顾细腻反馈与持续性能。
- 支持鼠标、触摸与混合输入设备动态切换，补齐 `svh`/`dvh`、安全区、窄横屏、极端字号及 44px 触控目标适配。
- 增强实时 reduced-motion 同步与观察器兜底；偏好切换时会完整清理触摸状态、粒子、余波、视差和待执行帧。
- 隔离不同 AudioContext 的在途 resume；旧上下文被系统关闭后，新上下文不再复用过期 Promise 或错误回滚 SFX/BGM 状态。
- 正在播放 BGM 时，即使浏览器先自动挂起音频再派发隐藏或 BFCache 事件，返回页面后也会按最新声音意图恢复。
- 完成 21 组 320×568 至 1024×768、100%–400% 字号与横竖屏组合复验，零横向溢出，卡片和交互目标保持完整。
- 复验键盘导航、跳转链接、ARIA、强制配色、实时动效偏好、音频构图故障及页面生命周期，未发现剩余控制台错误。

上一版本内容已移入 [v2.8.2 历史公告](docs/announcements/history/v2.8.2.md)，更早版本见 [v2.8.1](docs/announcements/history/v2.8.1.md)、[v2.8.0](docs/announcements/history/v2.8.0.md)、[v2.7.0](docs/announcements/history/v2.7.0.md)、[v2.6.0](docs/announcements/history/v2.6.0.md)、[v2.5.0](docs/announcements/history/v2.5.0.md)、[v2.4.0](docs/announcements/history/v2.4.0.md)、[v2.3.0](docs/announcements/history/v2.3.0.md)、[v2.2.0](docs/announcements/history/v2.2.0.md)、[v2.1.0](docs/announcements/history/v2.1.0.md) 与 [v2.0.0](docs/announcements/history/v2.0.0.md) 历史公告。
