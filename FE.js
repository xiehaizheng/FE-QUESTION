// ******************1、数组去重******************
const Array1 = [1, '1', 22, '233', undefined, null, null, undefined, {}, {}, [2], [2], [1, 2], [1], NaN, NaN];
Array.prototype.myUnique = function () {
  // 方式一
  // return Array.from(new Set(this));
  // 方式二
  // return [...new Set(this)];
  // 方式三
  // let arr = [];
  // for (let i = 0; i < this.length; i++) {
  //   if (!arr.includes(this[i])) {
  //     arr.push(this[i]);
  //   }
  // }
  // return arr;
  // 方式四
  return this.filter((item, index) => this.indexOf(item, 0) === index);
};
console.log(Array1.myUnique());
// 方式一二三：[1, '1', 22, '233', undefined, null, {}, [2], [1, 2], [1], NaN]
// 方式四：   [1, '1', 22, '233', undefined, null, {}, [2], [1, 2], [1]]

// ******************2、获取指定范围内的随机数(都是整数)******************
// Math.random() 用于生成一个介于 0（包含）和 1（不包含）之间的伪随机浮点数
function getRandom(min, max) {
  // (min,max) Math.round() 用于将数字四舍五入到最接近的整数
  // return Math.round(Math.random() * (max - min - 2) + min + 1);
  // [min,max]
  // return Math.round(Math.random() * (max - min) + min);
  // (min,max] Math.ceil() 用于将数字向上舍入到最接近的整数
  // return Math.ceil(Math.random() * (max - min) + min);
  // [min,max) Math.floor() 用于将数字向下舍入到最接近的整数
  return Math.floor(Math.random() * (max - min) + min);
}
console.log(getRandom(1, 10));


// ******************3、打印100以内的质数******************
// 质数：质数的定义是大于1的自然数，且只能被1和自身整除
function getPrimeNumber() {
  for (let i = 2; i <= 100; i++) {
    let isPrime = true;
    for (let j = 2; j < i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      console.log(i);
    }
  }
}
getPrimeNumber();

// ******************4、数组随机排序******************
const Array2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
function arrayRandomSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    const randomIndex = parseInt(Math.random() * arr.length);
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }
  return arr;
}
console.log(arrayRandomSort(Array2));

// 或者借助sort
Array2.sort(() => Math.random() - 0.5);

// ******************5、提取URL参数******************
const url = 'https://www.baidu.com?name=123&age=456';
function getUrlParams(URL) {
  const url = URL.split('?')[1];
  const urlSearchParams = new URLSearchParams(url);
  return Object.fromEntries(urlSearchParams.entries());
}
console.log(getUrlParams(url));


// ******************6、flatten******************
const Array3 = [1, [2, [3, 4]]];
function flatten(arr) {
  //方式一
  // return arr.flat(Infinity);
  // 方式二：递归
  // let res = [];
  // for (let i = 0; i < arr.length; i++) {
  //   if (Array.isArray(arr[i])) {
  //     res = res.concat(flatten(arr[i]));
  //   } else {
  //     res.push(arr[i]);
  //   }
  // }
  // return res;
  // 方式三：迭代
  // let res = [];
  // while (arr.length) {
  //   const item = arr.shift();
  //   if (Array.isArray(item)) {
  //     arr = item.concat(arr);
  //     console.log(arr);
  //   } else {
  //     res.push(item);
  //   }
  // }
  // return res;
  // 方式四：也是迭代
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
console.log(flatten(Array3));

// ******************7、给 a b c 三个请求，希望c在a b获取后再请求******************
// 方式一：promise.all
function getA() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Request A completed');
      resolve('a');
    }, 1000);
  });
}
function getB() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Request B completed');
      resolve('b');
    }, 2000);
  });
}
function getC() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Request C completed');
      resolve('c');
    }, 1000);
  });
}

Promise.all([getA(), getB()]).then(
  (res) => {
    console.log('Both A and B are completed:' + res);
    return getC();
  }
).then((res) => {
  console.log('Request C is completed:' + res);
}).catch((e) => {
  console.log('Error occurred:' + e);
});
// 方式二：async await
async function getABC() {
  const resA = await getA();
  const resB = await getB();
  const resC = await getC();
  console.log(resA, resB, resC);
}
getABC();
// 方式三：js实现
const fs = require('fs');
let arr = [];
function fn(data) {
  arr.push(data);
  if (arr.length === 2) {
    // 执行c请求
    console.log(arr);
  }
}

fs.readFile('./a.txt', 'utf8', (err, data) => {
  fn(data);
});

fs.readFile('./b.txt', 'utf8', (err, data) => {
  fn(data);
});

// ******************8、发布订阅******************
class EventEmitter {
  constructor() {
    this.events = {};
  }
  // 订阅事件
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  // 取消订阅事件
  off(event, listener) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  // 只订阅一次事件
  once(event, listener) {
    const onceListener = (...args) => {
      listener(...args);
      this.off(event, onceListener);
    };
    this.on(event, onceListener);
  }

  // 发布事件
  emit(event, ...args) {
    if (!this.events[event]) return;

    this.events[event].forEach(listener => {
      listener(...args);
    });
  }
}

// 使用示例
const emitter = new EventEmitter();

function responseToEvent(msg) {
  console.log(msg);
}
// 订阅事件
emitter.on('event1', responseToEvent);
// 发布事件
emitter.emit('event1', 'Event 1 triggered!');
// 取消订阅事件
emitter.off('event1', responseToEvent);
// 再次尝试发布事件（不会有任何输出，因为已经取消订阅）
emitter.emit('event1', 'This will not be logged.');
// 使用一次性订阅
emitter.once('event2', (msg) => console.log(msg));
// 发布事件（触发一次）
emitter.emit('event2', 'Event 2 triggered!');
// 再次尝试发布事件（不会有任何输出，因为是一次性订阅）
emitter.emit('event2', 'This will not be logged.');

// CSS开始
// ******************9、介绍下BFC及其应用******************
// 可参考：https://juejin.cn/post/7367290539982569510?searchId=20241119214231E80E1E0EA83D600B926E
// 1、什么是BFC（独立布局环境 内部元素布局 与外部互不影响）
// BFC（Block Formatting Context）即块级格式化上下文，是Web页面的CSS渲染模式，指定一个块级元素渲染的区域和规则

// 2、BFC的触发条件
// --设置浮动：float不为none
// --overflow不为visible: 设置 auto、scroll、hidden
// --绝对定位元素（position为absolute或fixed）
// --display: flex 或 inline - block

// 3、BFC的作用
// -- 解决外边距垂直坍塌
// -- 解决包含坍塌
// -- 清除浮动（浮动的元素会脱离文档流会，这样会使得父元素高度没有被撑开）
// -- 避免非浮动元素被浮动元素覆盖


// ******************10、介绍下BFC、IFC、GFC、FFC******************
// 参考：https://juejin.cn/post/7026276336687644680?searchId=20241119220438C240B9FC8F2C9D0F81DB
// 1、IFC（Inline Formatting Context）行内 格式化上下文
// 2、GFC（Grid Layout Formatting Context）网格布局 格式化上下文
// 3、FFC（Flex Formatting Context）弹性布局 格式化上下文
// 4、BFC（Block Formatting Context）块级 格式化上下文

// ******************11、flex布局如何使用******************
// display: flex;
// flex-direction: 主轴
// flex-wrap: 是否换行
// flex-flow: flex-direction 和 flex-wrap 的简写形式, 默认为：row nowrap
// justify-content: 主轴对齐方式
// align-items: 交叉轴对齐方式
// align-content: 多根轴线对齐方式

// 子元素属性
// order: 排列顺序 越小越靠前
// flex-grow: 放大比例 默认为0
// flex-shrink: 缩小比例 默认为1
// flex-basis: 指定元素在主轴上的初始大小 默认为auto
// flex: flex-grow、flex-shrink、flex-basis的简写 默认为0 1 auto


// ****************** 12、分析比较 opacity: 0、visibility: hidden、display: none 优势和使用场景 ******************
// -构造：
// 1、display: none 完全消失 不占任何空间 不能点击
// 2、visibility: hidden 不会消失 占空间 内容不可见 不能点击
// 3、opacity: 0 占据空间 内容不可见 可以点击
// -继承
// 1、display: none 不会继承
// 2、visibility: hidden 会继承
// 3、opacity: 0 不会继承
// -性能
// 1、display: none 文档回流
// 2、visibility: hidden 重绘 性能消耗较小
// 3、opacity: 0 重绘 性能消耗较小

// ******************13、如何使用CSS或js实现多行文本溢出省略效果，考虑兼容性******************
// 1、CSS实现
// --单行文本溢出省略
// overflow: hidden;
// text-overflow: ellipsis;
// white-space: nowrap;

// --多行文本溢出省略
// display: -webkit-box;
// -webkit-box-orient: vertical;
// -webkit-line-clamp: 3; // 限制行数
// overflow: hidden;
// text-overflow: ellipsis;

// --兼容性()
// P {
//   position: relative;
//  line-height: 20px;
//   /*设置容器高度为3倍行高就是显示3行*/
//   height: 60px;
//   overflow: hidden;
// }

// P::before {
//   content: '...';
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   padding-left: 40px;
//   background: -webkit-linear-gradient(left, transparent, #fff 55%);
//   background: -o-linear-gradient(right, transparent, #fff 55%);
//   background: -moz-linear-gradient(right, transparent, #fff 55%);
//   background: linear-gradient(to right, transparent, #fff 55%);  
// }

// 2、js实现