---
layout: post
category: ['git']
title: 源码私有、站点公开——GitHub双组织部署静态站
tags: ['GitHub', 'GitHub Pages', '部署', 'Actions', 'Astro']
author: 唐 治
email: 6637839@qq.com
description: GitHub免费版要求Pages源仓库必须公开，但源码又不想暴露，怎么办？把"源码"和"发布产物"拆到两个组织，用Deploy Key跨组织推送，源码私有、站点公开，免费版就能跑。
---

|  |  *目 录* |
| --- | --- |
| 1 | [整体架构说明](#arch) |
| 2 | [操作步骤](#steps) |
| 3 | [新增一个站点的标准流程](#newsites) |
| 4 | [常见问题排查](#faq) |
| 5 | [安全注意事项](#security) |

用GitHub免费个人账号部署静态站，有个绕不开的规则：

* 可以建无限**私有**仓库
* 但Pages的源仓库**必须公开**（免费版）
* 一个账号可以建多个Organization（组织）

源码不想公开，站点又必须公开——那就把"源码"和"发布产物"拆到两个组织里。下面以一个Astro静态站为例，记录整套方案。故有此文！

## 一、整体架构说明 <a name="arch"></a>

### 1.1 组织与仓库分工

为表述方便，先约定几个替代名字（实际使用时换成你自己的）：

| 角色 | 替代名称 | 可见性 | 说明 |
|---|---|---|---|
| 源码组织 | `example-dev` | 私有组织 | 存放Astro源码 |
| 源码仓库 | `example-dev/sample-app` | **Private** | 构建并推送产物 |
| Pages组织 | `example-pages` | 公开组织 | 存放发布产物 |
| Pages仓库 | `example-pages/sample-app` | **Public** | 只放`dist/`，开启Pages |
| 绑定域名 | `sample-app.com` | — | Astro `site`已按此配置 |

原则很简单：**一个私有仓库对应一个公开仓库，一一映射。**

### 1.2 架构图

```
GitHub 个人账号
│
├── 私有组织 example-dev
│   └── sample-app (Private)      ← Astro 源码 + GitHub Actions 构建
│            │
│            │  peaceiris/actions-gh-pages
│            │  （Deploy Key 跨组织推送）
│            ▼
└── 公开组织 example-pages
    └── sample-app (Public)       ← 只有 dist/ 产物，开启 Pages
             └── 绑定 sample-app.com
```

## 二、操作步骤 <a name="steps"></a>

### 第一步、创建两个组织

1. 登录GitHub，右上角头像 → **Your organizations** → **New organization**
2. 选 **Free** 计划
3. 创建私有组织：`example-dev`——存放私有源码
4. 创建公开组织：`example-pages`——存放Pages公开产物

#### 【注意】

组织名一旦创建可以改，但建议想好再定，因为会影响仓库URL。

### 第二步、创建源码仓库

* 组织：`example-dev`
* 仓库：`sample-app`
* 可见性：**Private** ✅

### 第三步、创建Pages仓库

* 组织：`example-pages`
* 仓库：`sample-app`
* 可见性：**Public** ✅

### 第四步、配置Deploy Key（跨组织推送钥匙）

这是**最关键的一步**——让私有组织能往公开组织推代码。

#### 4.1 生成本地SSH Key

打开终端，执行：

```bash
cd ~/projects/sample-app
ssh-keygen -t ed25519 -C "deploy@sample-app" -f deploy-key/sample-app/deploy_sample-app -N ""
```

生成两个文件：

* `deploy-key/sample-app/deploy_sample-app`（私钥，保密）
* `deploy-key/sample-app/deploy_sample-app.pub`（公钥，可以公开）

每个站点建议用**独立**的SSH Key，方便单独撤销权限。

#### 4.2 把公钥添加到公开仓库（接收端）

#### 【注意】

新建组织默认禁用Deploy keys（GitHub 2024-10起的策略）。如果Deploy keys页面显示 `Disabled by example-pages`，先到组织 `example-pages` 的 **Settings → Member privileges → Deploy keys** 选择 **Enabled** → Save，再回仓库配置。

1. 进入 `example-pages/sample-app` 仓库
2. **Settings** → **Deploy keys** → **Add deploy key**
3. 填写：
   * Title：`deploy-from-example-dev`
   * Key：粘贴 `deploy-key/sample-app/deploy_sample-app.pub` 的内容（macOS可用 `pbcopy < deploy-key/sample-app/deploy_sample-app.pub`）
   * ✅ 勾选 **Allow write access**（必须，否则推不了）
4. 点击 **Add key**

#### 4.3 把私钥添加到私有仓库（发送端）

1. 进入 `example-dev/sample-app` 仓库
2. **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
3. 填写：
   * Name：`DEPLOY_KEY`
   * Secret：粘贴 `deploy-key/sample-app/deploy_sample-app` 私钥文件内容（macOS可用 `pbcopy < deploy-key/sample-app/deploy_sample-app`）
4. 点击 **Add secret**

#### 【注意】

私钥内容要**完整复制**，包括 `-----BEGIN OPENSSH PRIVATE KEY-----` 和 `-----END OPENSSH PRIVATE KEY-----` 这两行。

### 第五步、在私有仓库里配置GitHub Actions工作流

在 `example-dev/sample-app` 里，用下面的内容**替换** `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Public Pages Repo

on:
  push:
    branches: [main]
  workflow_dispatch:        # 支持手动触发

permissions:
  contents: read

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to public repo
        uses: peaceiris/actions-gh-pages@v4
        with:
          deploy_key: ${{ secrets.DEPLOY_KEY }}
          external_repository: example-pages/sample-app  # 公开组织/仓库
          publish_branch: main                           # 公开仓库的分支
          publish_dir: ./dist                            # Astro 构建产物目录
          cname: sample-app.com                          # 防止 force_orphan 清掉 CNAME
          force_orphan: true
          user_name: github-actions[bot]
          user_email: github-actions[bot]@users.noreply.github.com
```

#### 【注意】

**必须替换现有工作流**。仓库里默认的 `deploy.yml` 用的是官方 `actions/configure-pages` + `actions/deploy-pages`，它只能把产物部署到**当前仓库**的Pages。本方案源码在私有仓库、Pages在公开仓库，官方工作流会报 `Get Pages site failed` 或推错地方，必须改用上面的 `peaceiris/actions-gh-pages` + Deploy Key方案。

`force_orphan: true` 会用最新产物覆盖公开仓库的 `main` 分支（不保留历史，公开仓原有的README会被覆盖）。若想保留公开仓的 `main`，可改为 `publish_branch: gh-pages`，并把Pages源分支设为 `gh-pages`。

### 第六步、配置Astro

`astro.config.mjs` 关键配置如下：

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sample-app.com',   // 站点绑定的域名
  trailingSlash: 'ignore',
  build: {
    format: 'directory',            // → some-page/index.html
  },
  compressHTML: true,
});
```

#### 【注意】

**`base` 留空，不要写 `/sample-app/`**。独立域名场景下 `base` 不填，否则CSS/JS会404。

### 第七步、推送代码，触发自动部署

本地 `origin` 已指向私有仓库，直接推：

```bash
cd ~/projects/sample-app
git remote -v        # 应显示 https://github.com/example-dev/sample-app.git
git add .
git commit -m "init: add astro site"
git push origin main
```

推送后：

1. 进入私有仓库 `example-dev/sample-app` → **Actions** 标签，确认工作流跑绿
2. 检查公开仓库 `example-pages/sample-app`，应能看到 `dist/` 里的文件
3. 进入公开仓库 → **Settings** → **Pages** → Source选 **Deploy from a branch** → `main` / `(root)` → Save

#### 【注意】

公开仓库的Pages Source**不要选GitHub Actions**——构建发生在私有仓库，公开仓库里没有对应工作流和artifact。必须选分支（`main` 或 `gh-pages`，与工作流的 `publish_branch` 一致）。

### 第八步、绑定一级域名

#### 8.1 GitHub侧

1. 进入 `example-pages/sample-app`
2. **Settings** → **Pages** → Custom domain
3. 输入：`sample-app.com`
4. 点击 **Save**
5. 等DNS生效后，勾选 **Enforce HTTPS**

#### 8.2 DNS侧（域名商后台）

本方案采用 **ALIAS / ANAME** 方案（apex直接指向组织Pages域名）：

| 类型 | 主机名 | 值 |
|---|---|---|
| ALIAS（或ANAME） | `@` | `example-pages.github.io` |
| CNAME | `www` | `example-pages.github.io` |

#### 【注意】

必须使用域名商提供的 **ALIAS / ANAME / CNAME展平** 功能。**不要直接给 `@` 添加普通CNAME记录**——apex的CNAME会与SOA/NS记录冲突，导致整个域名解析异常。

若域名商不支持ALIAS/ANAME，退回A记录方案：`@` 添加 `185.199.108.153`、`185.199.109.153`（任意2条即可，四条为完整冗余：`.108`–`.111`）；`www` 仍用CNAME。

**多个站点共存**：同一组织下的每个站点绑定各自的域名，DNS都指向 `example-pages.github.io`（或同一组GitHub IP）即可——GitHub按请求的Host分流，互不冲突。唯一限制是**同一个域名只能绑定一个Pages站点**。

DNS生效通常需要5分钟到48小时，耐心等待。

## 三、新增一个站点的标准流程 <a name="newsites"></a>

以后每加一个新站点，照着下面7步走（把 `<site>` 换成站点名、`<domain>` 换成域名）：

| 步骤 | 操作 | 在哪 |
|---|---|---|
| 1 | 建私有源码仓库 `example-dev/<site>` | 私有组织 |
| 2 | 建公开Pages仓库 `example-pages/<site>` | 公开组织 |
| 3 | 生成新SSH Key：`deploy-key/<site>/deploy_<site>` | 本地终端 |
| 4 | 公钥添加到公开仓库Deploy keys（勾Allow write access） | 公开仓库Settings |
| 5 | 私钥添加到私有仓库Secret `DEPLOY_KEY` | 私有仓库Settings |
| 6 | 写 `deploy.yml`（改 `external_repository` / `cname`） | 私有仓库 `.github/workflows/` |
| 7 | 配Astro `site` + DNS + Pages绑定 | 代码 + 域名商 + GitHub |

## 四、常见问题排查 <a name="faq"></a>

| 问题 | 原因 | 解决 |
|---|---|---|
| Deploy keys页面显示 `Disabled by example-pages`，没有 **Allow write access** | 新建组织默认禁用Deploy keys | 组织 `example-pages` → **Settings → Member privileges → Deploy keys** → **Enabled** → Save，再回仓库配置 |
| Actions报 `Permission denied (publickey)` | Deploy Key没配写权限 / 私钥填错 | 检查 `example-pages/sample-app` 的Deploy key是否勾选 **Allow write access**；重新完整复制私钥 |
| 私有仓Actions报 `Get Pages site failed` / `Not Found` | 用了官方 `actions/deploy-pages`工作流 | 换成第五步的 `peaceiris/actions-gh-pages` 跨组织方案；官方工作流只能部署到当前仓库 |
| 公开仓库没收到文件 | `external_repository` 写错 | 确认格式是 `example-pages/sample-app` |
| 页面样式全乱 / JS 404 | Astro `base` 配错 | `base` 留空，只填 `site` |
| Pages显示404 | 公开仓库Pages源分支没选对 | Settings → Pages → 选 `main`（或 `gh-pages`）分支 |
| 每次部署后自定义域名丢失 | `force_orphan` 清空了分支里的CNAME文件 | 工作流里加 `cname: sample-app.com`（本文已加） |
| 域名访问显示 `There isn't a GitHub Pages site here` | DNS未生效 / 自定义域名未保存 | 等DNS生效，或重新Save自定义域名 |
| HTTPS证书申请失败 | DNS未生效 / CNAME冲突 | 确认ALIAS/ANAME（或A记录）正确，删掉冲突的CNAME，等几分钟再点Enforce HTTPS |

## 五、安全注意事项 <a name="security"></a>

1. **Deploy Key私钥只上传到GitHub Secrets**，不要提交到代码；本地副本放在 `deploy-key/<site>/`，该目录应加入 `.gitignore`
2. **公开仓库只有构建产物**，不含源码、环境变量、API Key
3. 前端代码里的API请求走后端鉴权，不要把密钥写进Astro前端
4. 每个站点用独立SSH Key，方便单个撤销
5. 公开仓库建议开启 **Vulnerability alerts**（Settings → Security）

## 六、一句话总结

> 私有组织 `example-dev` 放源码，公开组织 `example-pages` 放Pages产物，GitHub Actions用Deploy Key跨组织推送，站点绑定 `sample-app.com`——免费版就能跑，源码不暴露。
