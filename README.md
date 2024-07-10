>如果您对这个项目感兴趣，欢迎在 [GitHub](https://github.com/mamumu123/magic-image) 上为我们点赞，您的支持将激励我们不断扩展项目功能。

## 效果展示

![截屏2024-06-30 19.45.45.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a595b6e5ee974d348275924f415bb975~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1404&h=1604&s=2041164&e=png&b=f7cfd5)

## 项目体验地址
[https://magic-image-eta.vercel.app](https://magic-image-eta.vercel.app)

## 项目源码地址
[源码地址](https://github.com/mamumu123/magic-image)

## 项目介绍
本项目旨在实现图片风格化功能，为您的照片打造个性化滤镜，支持毛毡、粘土、积木、美漫、玉石等搞笑涂鸦风格。我们的特色在于使用了 coze 的免费 api，尽管其限制较多。

如果您希望无限制地尝试风格化，欢迎直接访问 coze 官方网站，[照片滤镜](https://www.coze.cn/space/7347875527422099475/bot/7383904589537935371)




## ## 如何在项目中接入 COZE API
> 扣子支持将 Bot 发布为 API 服务，并开放了一系列接口，支持开发者在自己的应用中构建 AI 助手。


### Api 限额
这是一个重要的问题，因此我们先进行说明：

> 当前扣子 API 免费供开发者使用，每个空间的 API 请求限额如下：
> -   QPS (每秒发送的请求数)：2;
> -   QPM (每分钟发送的请求数)：60;
> -   QPD (每天发送的请求数)：3000;

然额度不多，但对于个人使用来说应该足够了。


### 如何创建自己的工作流并通过 api 使用
您可以按照以下步骤进行尝试：

#### 创建个人访问令牌
个人访问令牌（TOKEN）是用于 API 访问时进行鉴权的，与个人权益绑定，因此请妥善保管。您可以在[这里](https://www.coze.cn/open/api)创建。

> 要与他人共享您的个人访问令牌，也不要在浏览器或其他客户端代码中暴露它，以保护您账户的安全。若在公开场合发现任何泄露的个人访问令牌，该令牌可能会被自动禁用。



#### 创建工作流
首先，访问 [Coze 官网](https://www.coze.cn/)，然后创建工作流。

![324871719749321_.pic.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdaf673e4d5c40e693e7f0dd3d8e8171~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3254&h=932&s=217195&e=jpg&b=f3f3f5)


您可以自行搭建一个工作流，通过简单的拖拽即可完成：

![截屏2024-06-30 20.03.05.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98b3c221e7c6462d864ac64648ba5779~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3046&h=1578&s=453238&e=png&b=f2f3f5)

搭建完成后，点击“试运行”，然后点击“发布”即可。

#### 创建 BOT
返回“首页”，点击 “创建 BOT”。
在创建页面的左侧，输入 “使用 `<xxxx>` 的图像流来处理图片生成”，这里的 `<xxxx>` 是图像流的名称。然后在中间部分，引入自己之前发布的工作流。这样就完成了一个机器人的搭建，在右侧上传图片就可以尝试运行了。

![324881719749993_.pic.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4f193ff008b43d68280302f7b4a0f4e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3326&h=1786&s=378651&e=jpg&b=fafafa)

如果运行结果符合预期，就可以发布了。在发布页面，记得勾选最下方的 “Bot as API”。

![WechatIMG32489.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59c349cfb2bc4de4b8a4e83d0225d7b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3240&h=1740&s=311324&e=jpg&b=f7f6fb)

#### 通过接口访问

完成以上步骤后，您就可以通过 API 进行访问了：

```bash

### 
POST https://api.coze.cn/open_api/v2/chat
Authorization: Bearer <您的 TOEKN>
Content-Type: application/json
Accept: */*
Host: api.coze.cn
Connection: keep-alive

{
    "conversation_id": "123",
    "bot_id": "7383904589537935371",
    "user": "29032201862555",
    "query": "这是我提供的照片: image_url: https://gitee.com/lemC/picx-images-hosting/raw/master/WechatIMG32460.1aov3aqb5w.jpg, style_id: 0",
    "stream": false,
}
```


## 其他细节

### 接口时间过长，需要在 vercel 配置超时时间。

由于 Coze 接口的请求时间较长，超过了 Vercel 默认的 10 秒，因此需要在代码中配置 `maxDuration`。

```js
export const maxDuration = 60;   //  60 seconds
export function GET(request: Request) { 
    return new Response('Vercel', { status: 200, });
    }
```

## 参考地址

[coze 官网](https://www.coze.cn/home)



## 项目介绍

## Getting Started

First, set the environment variables:

```bash
export BOT_ID=123456
export COZE_TOKEN=pat_xxx
```

Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

## Deploy on Vercel
如果你没有自己的服务端，你可以免费的部署在 vercel 上。

