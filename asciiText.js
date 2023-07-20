import figlet from 'figlet';
import gradient from 'gradient-string';
import chalk from 'chalk';

//? Cria o título do projeto em ASCII.

export function asciiText() {
    return new Promise((resolve, reject) => {
        figlet.text(
            'Biblioteca do Vitu',
            {
                font: 'Big',
                horizontalLayout: 'default',
                verticalLayout: 'default',
                width: 100,
                whitespaceBreak: true,
            },
            function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    const text = gradient.vice.multiline(data);
                    console.log(text);

                    console.log(
                        '──────────────────────────────────────────────────────────────────────────────────'
                    );
                    resolve();
                }
            }
        );
    });
}
