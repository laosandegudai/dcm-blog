---
title: "深入理解 JavaScript 异步编程"
date: 2026-04-30 10:00:00
tags: [JavaScript, 异步, Promise, async/await]
categories: [技术]
keywords:
  - JavaScript
  - 异步编程
  - Promise
  - async/await
  - 回调函数
---

## 前言

JavaScript 的异步编程是前端开发中的核心概念。从回调函数到 Promise，再到 async/await，JavaScript 的异步处理方式不断演进。

## 回调函数（Callback）

早期 JavaScript 使用回调函数处理异步操作：

```javascript
function getData(callback) {
  setTimeout(() => {
    callback('数据加载完成');
  }, 1000);
}

getData((data) => {
  console.log(data);
});
```

**问题**：回调地狱（Callback Hell），代码难以维护。

## Promise

ES6 引入了 Promise，解决了回调地狱问题：

```javascript
function getData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('数据加载完成');
    }, 1000);
  });
}

getData()
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

**优势**：
- 链式调用，代码更清晰
- 统一的错误处理
- 更好的可读性

## async/await

ES7 引入的 async/await 让异步代码看起来像同步代码：

```javascript
async function fetchData() {
  try {
    const data = await getData();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
}
```

**最佳实践**：
1. 总是使用 try/catch 捕获错误
2. 避免 await 在循环中串行执行
3. 使用 Promise.all() 并行处理多个异步操作

## 总结

JavaScript 异步编程的演进让代码更加清晰、易维护。在现代开发中，推荐优先使用 async/await，配合 Promise.all() 处理并发场景。