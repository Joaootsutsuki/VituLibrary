import { createSpinner } from 'nanospinner';
import chalk from 'chalk';

//? Cria o spinner (a animação das bolinhas girando).
export function showSpinner(message, duration, finalMessage, finalIcon) {
    return new Promise((resolve) => {
        const spinner = createSpinner(chalk.yellow(message)).start();
        const color = finalIcon === 'success' ? 'green' : 'red';

        setTimeout(() => {
            spinner[finalIcon]({
                text: chalk[color](finalMessage),
            });
            resolve();
        }, duration);
    });
}
