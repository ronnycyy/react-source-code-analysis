# React 源码分析

## react-17.0.0-alpha
用于链接的打包后的 React

## react-17.0.3
用于链接的打包后的 React

## book
测试 DEMO

## repo
React v17.0.0 源码



### 高优先级的任务如何插队
又是 ensureRootIsScheduled！
```js
function ensureRootIsScheduled(root, currentTime) { 
if (existingCallbackNode !== null) {
  // 前面判断出 newCallbackPriority > existingCallbackPriority
  // 打断低优先级任务
  cancelCallback(existingCallbackNode);
  // 调度高优先级任务
  scheduleCallback(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root));
}
```
performConcurrentWorkOnRoot 会执行 prepareFreshStack 重置调用栈，也就是说，低优构建一半的 fiber 树会被直接废弃，重新开始构建 fiber 树。


### batchedUpdate
在一次回调中触发多次更新，只会 render 一次。
```js
// ~/packages/react-reconciler/src/ReactFiberWorkLoop.new.js
function ensureRootIsScheduled(root, currentTime) { 
  // existingCallbackNode 是第一个 setState 导致调度的 performConcurrentWorkOnRoot。
  if (existingCallbackNode !== null) {
    var existingCallbackPriority = root.callbackPriority;
    if (existingCallbackPriority === newCallbackPriority) {
      // 第二次以后的 setState 和 第一次 setState 的优先级是一样的，所以会进入这里直接返回。
      // 也就是说，后面不管有多少个 setState，都只会调度第一个 setState 的 performConcurrentOnRoot。
      return;
    }
  }
}
```
这就是 React 在 Concurrent Mode 下，通过 lane 实现的 batchedUpdate。
其关键在于: 一次回调中的多个 setState 返回的 lane 是一致，而返回同样的 lane 有两个条件: (lane = findUpdateLane(schedulerLanePriority, currentEventWipLanes))
1. schedulerLanePriority，这个没啥好说的，都是 Normal 优先级（即使都在 setTimeout 中也是）。
2. currentEventWipLanes，这个是关键。
```js
function requestUpdateLane(fiber, suspenseConfig) {
if (currentEventWipLanes === NoLanes) {
  // 只有第一个 setState 是 NoLanes，所以会进入这里，第二个往后都不会进入，保留了第一个的 currentEventWipLanes 的值。
  // 这样同一个回调的多次 setState，currentEventWipLanes 都是一样的。
  currentEventWipLanes = workInProgressRootIncludedLanes;
}
```

#### this.setState 的源码调用栈
1. enqueueSetState   选一条赛道(lane)，挂到 update 对象上。
2. scheduleUpdateOnFiber  从当前结点开始，一路往上，沿途通知本次更新。
3. ensureRootIsScheduled  根结点已经知道了更新和它的优先级，调度根结点。
4. scheduleCallback(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root))  通知 scheduler 调度 render 函数
5. 进入 render 阶段


### 并发模式的中断恢复逻辑

1. 调度 performConcurrentWorkOnRoot, ...time...,  执行 performConcurrentWorkOnRoot
2. 从 performConcurrentWorkOnRoot 进入 renderRootConcurrent 
3. 从 renderRootConcurrent 进入 workLoopConcurrent (render 阶段)
```js
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```
4. ⏰shouldYield!!! (5ms到了..)  render 阶段被打断... 
   打断的时候，workInProgress ✏ 记录着当前遍历到了哪一个 fiber 结点 (performUnitOfWork 知道)，这样恢复执行的时候，就知道从哪继续了。
5. 在 Scheduler 的 workLoop 中，currentTask.callback 是 performConcurrentWorkOnRoot，它返回 performConcurrentWorkOnRoot，作为 continuationCallback，又挂在 currentTask.callback。
6. Scheduler 立即调度 currentTask。
7. ....time......, 下一个时间片来了，执行 currentTask.callback, 也就是 continuationCallback，恢复被打断的工作。
