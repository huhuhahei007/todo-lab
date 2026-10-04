# 慢慢来 · 待办清单

一个无需安装依赖的中文待办网页，支持添加、完成、筛选、删除任务和清除已完成任务。

## 运行

需要 Python 3；在这个目录执行：

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

在本地运行时打开 http://localhost:3000；云端运行时需要环境提供的端口预览或转发入口。

也可以安装 Node.js 后使用 `npm start`，使用 `npm run check` 检查 JavaScript 语法。

## 数据

任务使用 localStorage 保存在当前浏览器、当前网站地址下。没有登录或服务器数据库；更换浏览器、网站地址或清除浏览器数据后，清单不会自动同步。不要保存敏感信息。

## GitHub

已包含 `.github/workflows/pages.yml` 自动部署配置。创建专门的 GitHub 仓库（建议命名 `todo-lab`），推送代码到 `main` 分支，再在仓库 Settings → Pages → Source 选择 **GitHub Actions**。

此后每次向 `main` 推送代码，都会检查 JavaScript 并部署网页。首次部署成功后，在 Actions 的 Deploy to GitHub Pages 运行记录中查看网站链接。

仓库地址：https://github.com/huhuhahei007/todo-lab 。首次发布需要在仓库设置中启用 GitHub Pages，部署是否成功以 Actions 运行结果为准。
