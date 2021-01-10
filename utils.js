export const runEffect = (effect) => effect();

export const log = (...args) => {
  const formattedArgs = args.map((arg) => {
    if (typeof arg === "object") {
      return JSON.stringify(arg, null, " ");
    }

    return arg;
  });

  console.log(...formattedArgs);
};
