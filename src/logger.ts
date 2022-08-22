import chalk, { ChalkInstance } from "chalk";

export declare type LogLevel = 'INFO' | 'WARNING' | 'ERROR';

export function log(level: LogLevel = 'INFO', message: string) {
    const date = new Date();
    const formattedMessage = `[${chalk.dim(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`)}] [${getChalkForLevel(level)(level)}] ${message}`;

    switch (level) {
        case "INFO":
            console.info(formattedMessage);
            break;
        case "WARNING":
            console.warn(formattedMessage);
            break;
        case "ERROR":
            console.error(formattedMessage);
            break;
        default:
            console.log(formattedMessage);
    }
}

function getChalkForLevel(level: LogLevel): ChalkInstance {
    switch (level) {
        case 'INFO': return chalk.green;
        case 'WARNING': return chalk.yellow;
        case 'ERROR': return chalk.red;
        default: return chalk.white;
    }
}