function withTimeout(promiseOrFactory, ms, onAbort) {
  const { promise: out, resolve, reject } = Promise.withResolvers();
  let timer = null;

  let taskPromise = null;
  let controller = null;

  if (typeof promiseOrFactory === "function") {
    controller = new AbortController();
    const signal = controller.signal;

    const userOnAbort = onAbort;
    onAbort = async () => {
      // 先中止底层（真正取消）
      try {
        controller.abort();
      } catch {}
      // 再执行用户的清理逻辑（允许是异步）
      if (typeof userOnAbort === "function") await userOnAbort();
    };

    taskPromise = promiseOrFactory(signal);
  } else {
    taskPromise = promiseOrFactory;
  }

  timer = setTimeout(async () => {
    try {
      onAbort && (await onAbort());
    } catch (err) {
      console.error("onAbort 执行出错：", err);
    }
    reject(new Error(`执行超时 ${ms}ms`));
  }, ms);

  taskPromise.then(resolve, reject).finally(() => clearTimeout(timer));
  return out;
}

async function runWithConcurrency(items, worker, maxConcurrency) {
  if (!items?.length) return;

  let i = 0;

  const workers = [];

  async function spawn() {
    while (i < items.length) {
      const idx = i++;
      await worker(items[idx], idx);
    }
  }

  const n = Math.max(1, Math.min(maxConcurrency, items.length));

  for (let k = 0; k < n; k++) workers.push(spawn());

  await Promise.allSettled(workers);
}

module.exports = {
  withTimeout,
  runWithConcurrency,
};
