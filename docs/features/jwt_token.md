  前端 Login 页
       |
       | POST /login + 表单数据
       v
  ✅ login() in auth.py
       |
       | → 生成 JWT → 返回 token
       v
  前端保存 token
       |
       | 后续请求附带 Authorization: Bearer <token>
       v
  ✅ get_current_user() in dependencies.py
       |
       | → 解析 token → 获取 user
       v
  后端接口拿到当前用户 → 进行权限校验、操作数据等
