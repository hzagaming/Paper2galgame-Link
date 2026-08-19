# v2.6.0：开场层卸载与极端字号重排

发布日期：2026-08-20

本次版本继续深查 UI、UX、SFX 与 BGM 边界，修复开场动画退场和超大字号下仍可能残留的隐蔽问题。

## 更新内容

- 修复开场层设置 `hidden` 后仍被组件样式强制显示的问题，动画完成和减少动态效果模式下都会真正移除固定渲染层。
- 修复极端文字放大与 320 px 窄屏组合下作者署名撑宽页面的问题，署名现在会按可用空间换行并安全断行。
- 扩充回归断言，防止开场层卸载和作者区域内在尺寸约束再次失效。
- 完整复测 18 组常规、短横屏、200% 文字与额外压力组合，确认发布范围内没有页面溢出、文字裁切或过小交互目标。
- 重新注入音频图连接、恢复、节点启动、增益、停止、关闭和快速切换故障，确认 SFX/BGM 均能安全回滚或恢复。

上一版本内容已移入 [v2.5.0 历史公告](docs/announcements/history/v2.5.0.md)，更早版本见 [v2.4.0](docs/announcements/history/v2.4.0.md)、[v2.3.0](docs/announcements/history/v2.3.0.md)、[v2.2.0](docs/announcements/history/v2.2.0.md)、[v2.1.0](docs/announcements/history/v2.1.0.md) 与 [v2.0.0](docs/announcements/history/v2.0.0.md) 历史公告。
