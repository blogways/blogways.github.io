---
layout: post
category: ['Astro']
title: 给 Astro 静态站接入 GA4 与 Search Console
tags: ['Astro', 'Google Analytics', 'GA4', 'Search Console', 'SEO', 'sitemap']
author: 唐 治
email: 6637839@qq.com
description: 纯静态 Astro 工具站怎么上统计和 SEO？GA4 直接注入 gtag、零依赖；Search Console 用 DNS 网域验证所有权，再引 @astrojs/sitemap 自动产出 sitemap-index。一篇讲清两件事，附 build 后 grep 产物的验证清单。
---

|  |  *目 录* |
| --- | --- |
| 1 | [背景与分工](#bg) |
| 2 | [GA4：注入 gtag 脚本](#ga4) |
| 3 | [Search Console：验证 + sitemap](#gsc) |
| 4 | [部署上线与线上验证](#deploy) |
| 5 | [GA4 与 GSC 的关系](#compare) |

接前一篇[《源码私有、站点公开——GitHub双组织部署静态站》]({% post_url 2026-11-06-github-pages-dual-org-deploy %})，站已经用 `sample-app.com` 跑起来了，源码在私有组织 `example-dev`、构建产物推到公开组织 `example-pages` 的 Pages。接下来要解决两件事：

* **GA4**——统计「用户在站上做什么」
* **Search Console**——搞清楚「Google 怎么看你的站」

两者互补，新站都该上。下面把两件事合在一篇记清楚。为表述方便，继续用前一篇约定的占位名（实际使用时换成你自己的）：站点 `sample-app.com`、源码组织 `example-dev`、Pages 组织 `example-pages`。故有此文！

## 一、背景与分工 <a name="bg"></a>

先把两件事的边界划清楚，免得串台：

| 维度 | GA4 | Search Console（GSC） |
|---|---|---|
| 回答的问题 | 用户在站上做什么 | Google 怎么看你的站 |
| 要不要改代码 | 要（注入 gtag） | 阶段 A 不要（DNS 验证）、阶段 B 要（sitemap） |
| 要不要引依赖 | 不要（直接 gtag） | 要（`@astrojs/sitemap`，权衡后破例） |
| 数据生效速度 | 实时（几秒内） | 慢（索引冷启动数天-数周） |
| 要不要验证域名 | 不需要 | 必须 |

整体顺序：

```
GA4：改代码 → build → 推送 → 实时报告看数据
GSC 阶段 A：DNS 加 TXT 记录 → 验证域名所有权（不动代码、不动仓库）
       ↓ 验证通过
GSC 阶段 B：引 sitemap 集成 → build → 推送 → 回 GSC 提交 sitemap-index
```

> GSC 里**没有已验证资源时，「Sitemap」「网址检查」这些功能根本不可点**，整个面板是空的。所以必须先验证、后做 sitemap——验证是钥匙，sitemap 是塞进屋里的清单，钥匙拿不到，清单塞进去也没人看。

## 二、GA4：注入 gtag 脚本 <a name="ga4"></a>

### 2.1 决策：直接 gtag，不引官方集成、不上 GTM

* 官方 `@astrojs/google-analytics` 集成会新增一个 npm 依赖，而直接把 gtag.js 注入 `<head>` 是纯 HTML/JS、零依赖，能做完所有事——**不值当引依赖**。
* 创建 GA 账号时流程会顺手给你建一个 Google Tag Manager（GTM）容器，于是你会拿到**两个 ID**：

| ID | 类型 | 用不用 |
|---|---|---|
| `G-XXXXXXXXXX` | GA4 Measurement ID | ✅ 用这个 |
| `GTM-XXXXXXXX` | GTM 容器 ID | ❌ 现在不用 |

GTM 的价值在于以后频繁增删各种第三方标签时不用改代码、后台点一下就行。对短期内只有 GA（也许再加个广告）两个标签的站，多套一层 GTM 纯属增加请求和复杂度，没收益。

> ⚠️ **千万别两个都装**：既直接装 gtag、又在 GTM 容器里也配 GA 标签——会双重计数。只走一条路。

### 2.2 关键事实（影响后面所有决策）

1. 全站只有一个根布局 `src/layouts/Base.astro`，所有页面（含子布局也只包一层 Base）都过它。GA 脚本**只注入这一处**就够。
2. `src/lib/site.js` 里的 `SITE` 对象是站点配置单一真源（已有 `adsEnabled` 这种开关），GA ID 自然放这里。
3. **GA Measurement ID（`G-XXXXXXX`）不是机密**——它本来就会出现在每个访客的页面源码里。所以**不需要 GitHub Secret**（和 `DEPLOY_KEY` 性质完全不同），直接写死在 `site.js` 即可。
4. 构建发生在私有仓、产物推到公开仓：GA ID 最终必然落在公开的 dist HTML 里（否则浏览器端没法加载），没有「留在私有仓」的意义。

### 2.3 GA 后台建账号（浏览器操作）

登录 [analytics.google.com](https://analytics.google.com)，依次：

1. **创建账号**——Account name 随便填。
2. **创建媒体资源 (Property)**——时区选**运营团队常住的时区**；币种选**与站点默认货币一致**的那一个。
3. **商家描述**——行业类别按站点实际主题选最近的一档（不必硬套「能源/公用事业」那类给发电卖电企业用的选项）；商家规模按小站身份选最小档即可。
4. **业务目标**——勾「Track/Drive website engagement」（内容工具站核心，必勾），其余按需，**只影响后台首页默认导航顺序，不改数据收集范围**，事后能改。
5. **创建数据流 (Data stream)**——平台选 Web；URL 填 `https://sample-app.com`；确认**增强衡量 (Enhanced measurement)** 开启（默认就是开），自动收 page_view / scroll / 出站点击等。
6. **拿到 Measurement ID**——数据流详情页右上角那串 `G-XXXXXXXXXX`（认准 **G- 开头**）。页面上还有一串纯数字叫「流 ID (Stream ID)」，那是另一回事，平时用不到。

> **时区与币种的影响范围很窄**：
> * 时区只影响 GA 后台「按天」展示数据的时间基准（日报表日期边界、实时报告的「今天」），不影响收不收数据、数据精度、归因逻辑。**能改，但历史数据不回溯重算**——改一次会出现一两天的接缝，所以第一次选对最省心。
> * 币种只影响 GA 后台「收入」类报表的显示币种，只有给事件配 `value` 时才用到，随时改、无副作用。
>
> 选哪个时区不是合规问题，是运营便利：受众活跃时段是哪个时区的白天，就设哪个时区，否则会在凌晨看到「今天流量峰值」，时间感错位。

### 2.4 改代码（两处文件，零依赖）

**`src/lib/site.js`** —— 在 `SITE` 对象里加一行：

```js
// Site-wide configuration — single source of truth.
export const SITE = {
  name: 'sample-app',
  url: 'https://sample-app.com',
  // ...
  adsEnabled: false,

  // Google Analytics 4 Measurement ID — non-secret (it appears in every visitor's
  // page source); loaded only in production builds via Base.astro.
  gaId: 'G-XXXXXXXXXX',
};
```

**`src/layouts/Base.astro`** —— 在 `</head>` 前注入两段 script，被 `import.meta.env.PROD && SITE.gaId` **双重守卫**：

{% raw %}
```astro
  {import.meta.env.PROD && SITE.gaId && (
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}`}></script>
  )}
  {import.meta.env.PROD && SITE.gaId && (
    <script is:inline define:vars={{ gaId: SITE.gaId }}>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', gaId);
    </script>
  )}
</head>
```
{% endraw %}

#### 【注意】

* `import.meta.env.PROD` 在 `astro build` 时为 true、`astro dev` 时为 false → **本地开发不加载 GA，不污染数据**。
* 第二个守卫 `SITE.gaId` → 未来若要临时关停，把 `site.js` 那行改成空字符串即可，不用删模板。
* `is:inline` 让 Astro 不去处理这段脚本（gtag 必须原样输出，不能被打包重写）。
* `define:vars`（传 `gaId: SITE.gaId`）把变量注入到 inline 脚本作用域，产物里会变成 `const gaId="G-XXXXXXXXXX"` + `gtag('config', gaId)`。

### 2.5 验证（build + grep 产物）

```bash
npm run build
```

| 检查项 | 命令 | 期望 |
|---|---|---|
| 全站页面注入 gtag | `grep -rl 'googletagmanager.com/gtag/js' dist \| wc -l` | = 页面总数 |
| 每页 loader 唯一 | `grep -c 'gtag/js?id=G-XXXXXXXXXX' dist/index.html` | = 1（不双重计数） |
| gaId 变量已注入 | grep `const gaId="G-XXXXXXXXXX"` | 存在 |
| 空占位残留 | `grep -c 'G-XXXXXXX' dist/index.html` | = 0 |
| NaN/undefined 残留 | `grep -c 'NaN\|undefined' dist/index.html` | = 0 |

> **踩坑提醒**：`compressHTML: true` 会把多行脚本压成一行，直接 grep `gtag('config', 'G-XXXXXXXXXX')`（字面量）会匹配不到——因为产物里是 `gtag('config', gaId)`（变量引用）。要 grep 变量定义 `const gaId="..."` 才能确认 ID 正确注入。
>
> `npm run dev` 受 PROD 守卫不会加载 GA，Network 里看不到 gtag 是预期行为。要在本地看 gtag 实际加载，用 `npm run preview`（加载 dist 产物，是生产构建）。

## 三、Search Console：验证 + sitemap <a name="gsc"></a>

### 3.1 阶段 A：验证域名所有权（强烈推荐 DNS 网域验证）

GSC 添加资源时让选两种类型：

| 资源类型 | 验证方式 | 覆盖范围 | 推荐度 |
|---|---|---|---|
| **网域 (Domain)** | **DNS TXT 记录** | `sample-app.com` + `www.` + `http/https` + 所有子域，**一次性全覆盖** | ✅ **强烈推荐** |
| 网址前缀 (URL prefix) | HTML meta 标签 / HTML 文件 / GTM 等 | 只覆盖单一前缀（如只有 `https://sample-app.com`，不含 www） | ❌ |

选 DNS（网域）的理由：域名和 DNS 控制权都在手里，加一条 TXT 记录一次搞定；以后要不要加 `www.`、要不要换 https 配置都不用重新验证。meta 标签验证（网址前缀方式）需要改 `Base.astro` 注入 `<meta name="google-site-verification">`，**会动代码**，且只覆盖一个前缀——既然有 DNS 这条路，没必要用 meta。

#### 操作步骤

1. 打开 [search.google.com/search-console](https://search.google.com/search-console)，用建 GA 时同一个 Google 账号登录。
2. 点「添加资源 (Add property)」→ 选「网域 (Domain)」（左边那张卡，不是右边的网址前缀）。
3. 输入域名：`sample-app.com`（**纯域名，不带 https://、不带 www**）。
4. 点「继续」，GSC 弹出一页，给一段 **TXT 记录值**，形如 `google-site-verification=ABCDEFGH12345...`，复制整串。
5. 去你的 DNS 提供商加这条 TXT 记录：

   | 字段 | 填什么 | 说明 |
   |---|---|---|
   | 主机记录 (Host) | `@` | 代表根域名，**不要**填 www |
   | 记录类型 (Type) | `TXT` | 下拉选 TXT |
   | 线路类型 (Lines) | `默认` | 保持默认 |
   | 记录值 (Value) | 粘 GSC 给的整串 | 含等号整串粘，不要截断、不要加引号 |
   | TTL | `600` 或默认 | 小一点验证快点 |

6. 回 GSC 那个验证页点「验证」：通过 → 资源状态「已验证」，进主面板；没通过 → DNS 还没全球生效，**别慌，等 5-30 分钟再点**。

#### 【注意】

* **验证通过后那条 TXT 记录别删**——删了所有权失效、GSC 停止收集数据。它会一直留在 DNS 里，无害。
* 如果 DNS 用 Cloudflare：那条 TXT 记录的 **Proxy status 必须是 DNS only（灰色云）**，不能开橙色云代理。TXT 验证只认 DNS 直查，走代理会失败。
* GSC 给的值形态可能是 `google-site-verification=xxxxx`（带前缀）或纯 token 串，**显示什么就粘什么**，不要自己加工。

#### 验证通过后先手动提交核心 URL

sitemaps 还没上线，但可以手动让 Google 知道核心页面存在：GSC 左侧「网址检查 (URL Inspection)」→ 输入首页 `https://sample-app.com/` → 点「请求编入索引 (Request indexing)」→ 对几个核心页重复。

> 手动提交有配额限制（每月每资源有限次数），别提交全部页面——挑核心页即可。其余靠阶段 B 的 sitemap 让 Google 自己发现。

### 3.2 阶段 B：上线 sitemap + robots.txt（引 `@astrojs/sitemap`）

#### 决策：引集成还是手写端点

| 维度 | 手写 `src/pages/sitemap.xml.js` 端点 | `@astrojs/sitemap` 官方集成 |
|---|---|---|
| npm 依赖 | 0 | +1 集成 + 传递依赖 |
| 代码量 | ~30 行手写 | `astro.config` 加 2 行 + robots 1 行 |
| 页面发现 | 手动维护数组 | **自动扫描 src/pages**（加页自动同步） |
| 多语言未来 | 手动处理 | 集成有 i18n 内置支持 |
| 索引结构 | 单文件 `sitemap.xml` | `sitemap-index.xml` + `sitemap-0.xml` |
| 维护成本 | 加页要改代码 | **加页零改动** |

**这次值得破例引集成**：sitemap 和 GA 不同——GA 那次引依赖零收益（直接 gtag 已做完所有事），但 sitemap 集成有**真实收益**：自动发现页面 + 多语言 i18n 支持。本站内容是数据驱动、高频增删的，集成能让 sitemap 永远自动同步，不用手动维护 URL 数组。

> 取舍原则：守「无新依赖」是软约束（不是硬约束），当依赖能带来真实收益（而非糖衣）时，值得破例。GA 那次不值，sitemap 这次值。反过来，页面少且固定（如纯企业官网几个页面永不增删）的站，手写更划算。

#### 装集成、改配置

```bash
npm install @astrojs/sitemap --save
```

`astro.config.mjs`：

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sample-app.com',   // ← 集成靠 site 字段生成绝对 URL，必须已配
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  compressHTML: true,
  integrations: [
    // Auto-discovers all src/pages routes; emits sitemap-index.xml + sitemap-0.xml.
    // Submit https://sample-app.com/sitemap-index.xml in Google Search Console.
    sitemap(),
  ],
});
```

#### 【注意】

* `site` 字段必须有值，集成靠它生成绝对 URL，缺失会报错。
* `sitemap()` 用最简默认配置：自动发现 `src/pages` 全部路由，输出索引结构。
* 没配 `lastmod`——默认不输出。**lastmod 是可选字段，缺失不影响**，但**也是最易被滥用的字段**：填错（如填未来时间、或全站填同一时间）Google 会忽略它。要么填真实更新时间，要么不填。以后想给页面输出真实更新时间，再配 `filter` 函数读数据源的更新字段，不急。

#### 新建 `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://sample-app.com/sitemap-index.xml
```

> `public/` 下的文件 Astro 原样拷到 dist 根，零代码改动。**URL 是 `sitemap-index.xml`**（不是 `sitemap.xml`）——集成默认产物是索引文件 `sitemap-index.xml` + 内容文件 `sitemap-0.xml`，robots.txt 要指向索引文件。本站没后台、没管理页、没 `/api`，无 `Disallow`。

#### trailing slash 一致性

本项目 `astro.config.mjs` 是 `trailingSlash: 'ignore'` + `build.format: 'directory'`，产物是 `xxx/index.html`，访问 `xxx` 和 `xxx/` 都通。集成输出的 sitemap URL **统一带尾斜杠**，与 `Base.astro` 里 `canonical` 和 `hreflangs` 的输出口径一致——这点集成自动处理对了，不用管。

> trailing slash 一致性是 sitemap 易错点：sitemap 里 URL 形态要和 canonical 标签一致，否则 Google 可能当成两个不同 URL 处理。用集成的好处之一就是它跟 Astro 的 trailingSlash 配置联动，不会错配。

#### 验证（build + grep 产物）

```bash
npm run build
```

| 检查项 | 命令 | 期望 |
|---|---|---|
| sitemap-index.xml 存在 | `ls dist/sitemap-index.xml` | 存在，指向 sitemap-0.xml |
| sitemap-0.xml 存在 | `ls dist/sitemap-0.xml` | 存在 |
| URL 数量 | `grep -o '<loc>' dist/sitemap-0.xml \| wc -l` | = 页面总数 |
| 尾斜杠 | 全部 URL 带 `/` | 0 个不带 |
| 域名 | 全为 `sample-app.com`，无 localhost | 0 个异常 |
| XML 合法性 | `python3 -m xml.dom.minidom dist/sitemap-0.xml` | 解析无报错 |
| robots.txt | `cat dist/robots.txt` | 4 行，指向 sitemap-index.xml |
| NaN/undefined 残留 | `grep -c 'NaN\|undefined'` | = 0 |

## 四、部署上线与线上验证 <a name="deploy"></a>

```bash
# GA4 那次
git add src/lib/site.js src/layouts/Base.astro
git commit -m "feat(analytics): 接入 GA4"

# sitemap 那次
git add astro.config.mjs package.json package-lock.json public/robots.txt
git commit -m "feat(seo): 接入 sitemap + robots.txt"

git push origin main
```

push 到私有仓 `example-dev/sample-app` main → GitHub Actions 自动 build → 跨组织推 dist 到公开仓 `example-pages/sample-app` Pages。

### 线上验证（部署完成约 5 分钟后）

**GA4**：

1. 打开 `sample-app.com`，DevTools → Network，刷新，过滤 `gtag`：
   * 应看到 `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`（200）
   * 随后有一两个发往 `https://www.google-analytics.com/g/collect` 的请求（GA 命中）
2. 回 GA 后台「实时 (Realtime)」报告，1-5 分钟内应出现 1 个活跃用户（你自己）。

> 实时报告一直为 0 的排查：浏览器装了广告拦截插件（uBlock/AdGuard 等会挡 gtag）→ 关掉插件或用隐身窗口；或看页面源码（Cmd+U）搜 `googletagmanager`，确认线上 HTML 里确实有 `id=G-XXXXXXXXXX`。

**GSC 提交 sitemap**：

1. 浏览器直接打开 `https://sample-app.com/sitemap-index.xml`、`/sitemap-0.xml`、`/robots.txt`，确认可访问、内容是新的（404 或内容旧 → Actions 还没跑完或 Pages 缓存未刷新，等几分钟再试）。
2. 进 Search Console → `sample-app.com` 资源 → 左侧「站点地图 (Sitemaps)」。
3. 顶部输入框填**完整 URL**：`https://sample-app.com/sitemap-index.xml`，含 `https://` + 域名 + 文件名整串粘进去 → 点「提交」。

> 输入框前面可能显示一行灰色 `https://sample-app.com/` 作为前缀提示，看着像「只填后面部分」——是视觉误导，实际要完整 URL。直接粘完整 URL，GSC 不会因前缀重复报错。

### 预期时间线

| 时间 | GSC 里能看到什么 |
|---|---|
| 提交即刻 | 「已提交 / 待处理」 |
| 几小时内 | 状态变「成功」，发现 URL 数 ≈ 页面总数 |
| 1-3 天 | 「网页索引编制」报告开始有数据 |
| 数天-数周 | 实际页面陆续进 Google 索引 |

> 新站索引有冷启动期，不要因为「提交后第二天还搜不到」就以为失败。用 GSC 的「网址检查」逐个查核心页的「索引状态」最准，比 `site:` 搜索更早反映。

## 五、GA4 与 GSC 的关系 <a name="compare"></a>

| 维度 | GA4 | Search Console |
|---|---|---|
| 回答的问题 | 用户在站上做什么 | Google 怎么看你的站 |
| 要不要改代码 | 要（注入 gtag） | 阶段 A 不要、阶段 B 要 |
| 要不要引依赖 | 不要（直接 gtag） | 要（`@astrojs/sitemap`，权衡后破例） |
| 数据生效速度 | 实时（几秒内） | 慢（索引冷启动数天-数周） |
| 验证方式 | 不需要验证域名 | 必须验证域名所有权 |
| 新站优先级 | 高（立刻看流量） | 高（越早提交越早进索引） |

两件事配套食用：**GA 看人来、GSC 看 Google 来**。GSC 的「搜索关键词 / 曝光 / 点击」和 GA 的「流量来源」对照看——GSC 告诉你「在 Google 搜什么词找到你」，GA 告诉你「来了之后做了什么」。

## 六、后续待办（现在不用做）

* **Cookie 同意横幅**：等以后开欧洲语言版本时，GA4 默认会种 cookie，届时需要加同意层（Consent Mode v2）才合规，单独处理、不阻塞现在。
* **GTM 容器 `GTM-XXXXXXXX`**：暂时空着不管。以后真的要堆一堆第三方标签时再启用，或去 tagmanager.google.com 删掉。
* **lastmod 配置**：以后想给页面输出真实更新时间，配 `sitemap()` 的 `filter` 函数读数据源的更新字段。
* **多语言 sitemap**：开翻译版本时，用集成的 `i18n` 配置项，自动生成各语言 hreflang 关联的 sitemap 条目。
* **索引状态监控**：GSC「网页索引编制」报告定期看，发现「已抓取但未编入索引」的页面排查原因（通常是内容薄、canonical 冲突、或新站权重低）。

---

> 附：本次改动文件清单
>
> | 文件 | 改动 |
> |---|---|
> | `src/lib/site.js` | `SITE` 加 `gaId`（+注释） |
> | `src/layouts/Base.astro` | `</head>` 前注入两段 PROD 守卫的 gtag script |
> | `package.json` / `package-lock.json` | +`@astrojs/sitemap` 依赖 |
> | `astro.config.mjs` | +import、+`integrations: [sitemap()]` |
> | `public/robots.txt` | 新建（4 行） |
>
> GA4 部分零新依赖；sitemap 部分引 1 个集成依赖。`npm run build` 全部通过。
