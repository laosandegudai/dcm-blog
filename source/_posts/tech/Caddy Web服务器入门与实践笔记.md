---
title: "Caddy Web服务器入门与实践笔记"
date: 2026-05-23 18:15:22
updated: 2026-05-26 22:04:25
author: "戴箍的三佬"
excerpt: "Caddy Web 服务器"
tags:
  - Caddy
keywords:
  - Caddy
  - Web服务器
  - HTTPS
  - 反向代理
  - 静态站点
---
本文档基于一次完整的 Caddy 配置过程整理，涵盖安装、静态站点部署、常见问题排查以及独立日志配置等实用内容。

# 1. 安装 Caddy
在 Ubuntu/Debian 系统上，使用官方仓库安装，下载二进制太慢了就用仓库安装了，离线环境没尝试：

bash
# 添加官方仓库
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg
sudo chmod o+r /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

## 安装
```bash
sudo apt update
sudo apt install caddy
```

## 验证
```bash
caddy version
```
安装完成后，Caddy 会自动以 systemd 服务形式运行，用户为 caddy。

#2. 准备静态网站文件
假设网站域名为 xiaowanghu.com，静态文件存放于 /var/www/xiaowanghu.com（推荐使用 /var/www 以避免权限问题）。

```bash
sudo mkdir -p /var/www/xiaowanghu.com
echo '<h1>Hello from Caddy!</h1>' | sudo tee /var/www/xiaowanghu.com/index.html
```
如果文件位于 /root 或其他用户目录下，需要修改权限（见后文）。

3. 配置 Caddyfile
Caddy 的配置文件位于 /etc/caddy/Caddyfile，也可以使用自定义路径。下面是一个同时处理主域名和 www 子域名并强制重定向的配置：
```bash
xiaowanghu.com, www.xiaowanghu.com {
    root * /var/www/xiaowanghu.com
    file_server
    # 将 www 流量重定向到主域名
    @www {
        host www.xiaowanghu.com
    }
    redir @www https://xiaowanghu.com{uri} permanent
}
```

root *：指定网站根目录。

file_server：开启静态文件服务。


注意事项
域名必须解析到服务器 IP，Caddy 会自动申请 Let'S Encrypt 证书。

不要使用 Tab 缩进，建议使用空格。可以通过` caddy fmt --overwrite` Caddyfile 自动格式化。

4. 启动与重载配置
启动服务
```bash
sudo systemctl enable caddy   # 开机自启
sudo systemctl start caddy    # 立即启动
```

重载配置（零停机）
修改 Caddyfile 后，执行：

```bash
caddy reload --config /path/to/Caddyfile
```

或者使用系统服务重载：
```bash
sudo systemctl reload caddy
```

验证配置语法
```bash
caddy validate --config /path/to/Caddyfile
```

5. 常见问题与解决方案
5.1 访问网站返回 403 Forbidden
原因：Caddy 进程以 caddy 用户运行，没有权限读取网站根目录（尤其是位于 /root、/home 等目录下时）。

解决方案：

推荐：将网站文件移动到 /var/www/ 或 /srv/ 下，并修改所有者：

```bash
sudo chown -R caddy:caddy /var/www/xiaowanghu.com
```

临时方案：修改现有目录的所有权（不推荐，可能带来安全风险）：

```bash
sudo chown -R caddy:caddy /root/dcm/app/www/xiaowanghu.com
```

5.2 使用 curl https://localhost 时出现 TLS 错误
错误示例：curl: (35) TLS connect error: error:0A000438:SSL routines::tlsv1 alert internal error

原因：Caddy 为 localhost 签发的是自签名证书，不被系统信任，本地问题无需理会。

解决方案：

忽略证书验证（仅测试）：

bash
curl -k https://localhost
为 localhost 单独配置 HTTP 站点（推荐开发环境）：

caddy
http://localhost {
    root * /var/www/xiaowanghu.com
    file_server
}
信任 Caddy 本地根证书（完全模拟 HTTPS）：

bash
# 找到 root.crt 文件
sudo find / -name "root.crt" 2>/dev/null
# 复制到系统证书目录
sudo cp /var/lib/caddy/.local/share/caddy/pki/authorities/local/root.crt /usr/local/share/ca-certificates/caddy-root.crt
sudo update-ca-certificates
5.3 域名 www.xiaowanghu.com 无法访问
原因：Caddyfile 中未配置该域名，或者 DNS 未解析。

解决方案：在站点配置中同时列出两个域名，或添加重定向（参见第3节配置示例）。

5.4 查看日志定位权限问题
使用 journalctl 查看 Caddy 服务日志：

bash
sudo journalctl -u caddy --no-pager -n 50
如果希望看到更详细的 debug 日志，可以在 Caddyfile 顶部添加：

caddy
{
    debug
}
然后重载配置并再次查看日志。

# 6. 配置独立的站点访问日志
Caddy 可以为每个站点单独记录访问日志，避免所有日志混在一起。

## 6.1 基本配置
在站点的 log 指令中指定输出文件：

```bash
xiaowanghu.com {
    root * /var/www/xiaowanghu.com
    file_server
    log {
        output file /var/log/caddy/xiaowanghu.access.log
    }
}
```

6.2 日志轮转（可选）
添加轮转参数，防止日志无限增长：

```bash
log {
    output file /var/log/caddy/xiaowanghu.access.log {
        roll_size 100mb   # 单文件最大 100MB
        roll_keep 5       # 保留最近 5 个轮转文件
        roll_keep_for 720h # 保留 30 天
    }
}
```

6.3 常见错误：permission denied 写入日志文件
错误信息：open /var/log/www/xiaowanghu.access.log: permission denied

原因：日志目录 /var/log/www 不存在或不属于 caddy 用户。

解决方案：

使用 Caddy 预留的日志目录（最简单）：

bash
# Caddy 安装后会自动创建 /var/log/caddy 并授权给 caddy 用户
# 只需将 output file 指向该目录即可
手动创建目录并授权：
```bash
sudo mkdir -p /var/log/www
sudo chown caddy:caddy /var/log/www
sudo chmod 755 /var/log/www
```

# 8. 总结
Caddy 的最大优势是自动 HTTPS 和简洁的配置语法。但是文档真的是一言难尽，不够系统纯api。




