import chalk from "chalk";

const { log } = console;

interface LogHandler {
  (message: string): void;
}

export const success: LogHandler = (msg) => {
  const message = `${chalk.bgGreen.bold(" SUCCESS ")}  ${msg}`;
  log(message);
};

export const error: LogHandler = (msg) => {
  const message = `${chalk.bgRed.bold(" ERROR ")}  ${msg}`;
  log(message);
};

export const warn: LogHandler = (msg) => {
  const message = `${chalk.bgYellow.bold(" WARN ")}  ${msg}`;
  log(message);
};

export const info: LogHandler = (msg) => {
  const message = `${chalk.bgBlue.bold(" INFO ")}  ${chalk.gray.italic(msg)}`;
  log(message);
};

export const debug: LogHandler = (msg) => {
  if (process.env.NODE_ENV === "development") {
    const message = `${chalk.bgMagenta.bold(" DEBUG ")}  ${chalk.gray.italic(msg)}`;
    log(message);
  }
};

export const important: LogHandler = (msg) => {
  const message = `${chalk.inverse(msg)}`;
  log(message);
};
