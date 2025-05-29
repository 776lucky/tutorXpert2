# 家教地图筛选功能（Map Filter in Search Tutor Page）

## 功能概述

用户可在地图上拖动、缩放视图，系统实时获取当前地图边界，并筛选出该区域内的 tutor 显示在地图和列表中。

## 使用流程

- 用户进入“搜索家教”页面
- 拖动或缩放地图
- 系统发起请求筛选当前视图内的 tutor
- 返回结果用于渲染地图上的 marker 和列表卡片

---

## 实现要点

地图拖动 → 获取新 bounds → 发请求给后端 /tutors/search → 数据库查找 → 返回新数据

### 地图交互

- 使用 `react-leaflet` 渲染地图
- 监听 `moveend` 事件获取地图边界（东北角、南西角）
- 调用后端接口，传入地图边界参数

### 请求接口

GET /tutors/search?north=...&south=...&east=...&west=...&subject=...

### 响应字段

- id
- name
- lat
- lng
- subjects
- address

---

## 数据库要求（profile 表）

需添加以下字段：

- ALTER TABLE profile ADD COLUMN latitude FLOAT NOT NULL DEFAULT 0;
- ALTER TABLE profile ADD COLUMN longitude FLOAT NOT NULL DEFAULT 0;



