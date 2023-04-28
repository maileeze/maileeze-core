import chalk from "chalk";

export function success(msg: string) {
  console.log(`${chalk.green("SUCCESS")}: ${msg}`);
}

export function error(msg: string) {
  console.log(`${chalk.bgRed("ERROR")}: ${msg}`);
}

export function warning(msg: string) {
  console.log(`${chalk.bgYellow("WARNING")}: ${msg}`);
}
