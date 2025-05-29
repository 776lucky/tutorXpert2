# Tutor 搜索接口文档（/tutors/search）

提供基于地图边界和筛选条件的家教搜索功能。

---

## 接口说明

- **接口路径**：`GET /tutors/search`
- **功能**：返回在指定地图范围内的 tutor 列表，可附带筛选条件

---

## 请求参数

| 参数名   | 类型   | 是否必填 | 说明                     |
|----------|--------|----------|--------------------------|
| north    | float  | 是       | 地图视图最北纬度         |
| south    | float  | 是       | 地图视图最南纬度         |
| east     | float  | 是       | 地图视图最东经度         |
| west     | float  | 是       | 地图视图最西经度         |
| subject  | string | 否       | 要筛选的科目关键词（模糊匹配） |

---

## 示例请求

GET /tutors/search?north=-33.85&south=-33.90&east=151.25&west=151.20&subject=math


---

## 返回数据格式

返回 `200 OK`，数据为包含 tutor 对象的数组：

```json
[
  {
    "id": 12,
    "name": "Alice Zhang",
    "lat": -33.875,
    "lng": 151.210,
    "subjects": ["Math", "Physics"],
    "address": "Chatswood, Sydney"
  },
  {
    "id": 17,
    "name": "Tom Lee",
    "lat": -33.885,
    "lng": 151.215,
    "subjects": ["English"],
    "address": "Macquarie Park"
  }
]
