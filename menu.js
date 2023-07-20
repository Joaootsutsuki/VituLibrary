import inquirer from 'inquirer';
import chalk from 'chalk';
import { showSpinner } from './spinner.js';
import {
    findBook,
    listDonatedBooks,
    printBook,
    printBooks,
    changeBookValues,
    deleteBook,
} from './booksUtils.js';
import { startCode } from './index.js';

function customSeparator(color, width) {
    return new inquirer.Separator(chalk[color](new Array(width).fill('─').join('')));
}
//? Função responsavel por perguntar se o usuario quer voltar ao menu principal.

export function askUserMenuOption(callback) {
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'backMainMenu',
                message: 'Você deseja voltar ao menu principal? ',
            },
        ])
        .then((answers) => {
            if (answers.backMainMenu) {
                startCode();
            } else {
                callback();
            }
        });
}

//? Função do menu principal.

export async function mainMenuInput() {
    inquirer
        .prompt({
            name: 'mainMenu',
            type: 'list',
            message: 'Escolha algumas das opções a seguir:',
            choices: [
                { name: '1) Ver volumes disponíveis', value: 1 },
                { name: '2) Procurar volume pelo código', value: 2 },
                { name: '3) Procurar volume pelo nome', value: 3 },
                { name: '4) Ver volumes doados', value: 4 },
                { name: '5) Ver volumes comprados com 100 à 300 páginas', value: 5 },
                { name: '6) Alterar registro de um volume', value: 6 },
                { name: '7) Excluir volume da biblioteca', value: 7 },
                new inquirer.Separator(),
                { name: chalk.redBright('0) Sair'), value: -1 },
            ],
            pageSize: 10,
        })
        .then(async (answer) => {
            switch (answer.mainMenu) {
                case 1:
                    await showSpinner(
                        'Buscando Volumes...',
                        2000,
                        'Os volumes achados estão a seguir!\n',
                        'success'
                    );
                    printBooks();
                    askUserMenuOption(() => {
                        console.log(
                            chalk.yellowBright('\n Obrigado por usar a nossa biblioteca!', '🥰👍')
                        );
                    });

                    break;
                case 2:
                    searchMenu('code');
                    break;
                case 3:
                    searchMenu('title');
                    break;
                case 4:
                    await showSpinner(
                        'Buscando Livros Doados...',
                        2000,
                        'Os livros doados estão a seguir!\n',
                        'success'
                    );
                    listDonatedBooks();
                    askUserMenuOption(() => {
                        console.log(
                            chalk.yellowBright('\n Obrigado por usar a nossa biblioteca!', '🥰👍')
                        );
                    });

                    break;
                case 5:
                    await showSpinner(
                        'Buscando livros comprados/doados entre 100 à 300 páginas...',
                        2000,
                        'Os livros comprados/doados entre 100 à 300 páginas estão a seguir!\n',
                        'success'
                    );

                    listDonatedBooks(100, 300);
                    askUserMenuOption(() => {
                        console.log(
                            chalk.yellowBright('\n Obrigado por usar a nossa biblioteca!', '🥰👍')
                        );
                    });

                    break;
                case 6:
                    const book = await searchMenu('code', false);
                    await changeBookValuesMenu(book.book);

                    break;
                case 7:
                    const object = await searchMenu('code', false);
                    await confirmDeletion(object);

                    break;
                case -1:
                    console.log(
                        chalk.yellowBright('\n Obrigado por usar a nossa biblioteca!', '🥰👍')
                    );
                    break;
                default:
                    console.log(chalk.redBright('Deu zebra aqui!!'));
            }
        });
}

//? Cria o menu para realizar a pesquisa.

export async function searchMenu(searchField, show = true) {
    return new Promise((resolve) => {
        inquirer
            .prompt([
                {
                    name: 'search_value',
                    type: 'input',
                    message: `Insira o ${
                        searchField === 'code' ? 'código' : 'nome'
                    } do livro para realizar a pesquisa: `,
                    validate: (input) => {
                        if (!/^[1-9]\d*$/.test(input) && searchField === 'code') {
                            return 'Por favor, insira um número inteiro válido maior que 0.';
                        }
                        return true;
                    },
                },
                {
                    name: 'search_area',
                    type: 'input',
                    message: 'Insira uma área válida (Exatas, Humanas ou Biomedicina):',
                    validate: (input) => {
                        const lowString = input.toLowerCase();
                        if (['exatas', 'humanas', 'biomedicina'].indexOf(lowString) === -1) {
                            return 'Por favor, insira uma área válida (Exatas, Humanas ou Biomedicina).';
                        }
                        return true;
                    },
                },
            ])
            .then(async (answers) => {
                const { search_area, search_value } = answers;

                const searchValue =
                    searchField === 'code' ? parseInt(search_value) : search_value.toLowerCase();

                const areaMap = {
                    exatas: 'exactSciences',
                    humanas: 'humanSciences',
                    biomedicina: 'biomedicalSciences',
                };
                const nameArea = areaMap[search_area.toLowerCase()];

                const foundBook = await findBook(searchValue, searchField, nameArea);
                if (foundBook) {
                    await showSpinner(
                        'Buscando livro...',
                        2000,
                        'O livro encontrado está a seguir!',
                        'success'
                    );
                    printBook(foundBook, 'cyan');
                    if (show) {
                        askUserMenuOption(() => searchMenu(searchField));
                    }
                    resolve({ book: foundBook, area: nameArea });
                } else {
                    await showSpinner(
                        'Buscando livro...',
                        2000,
                        'Desculpe, o livro infelizmente não foi encontrado!',
                        'error'
                    );
                    askUserMenuOption(() => searchMenu(searchField));
                }
            });
    });
}

//? Cria o menu usado para mudar os registros.

async function changeBookValuesMenu(book) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'selectedField',
                message: 'Escolha uma opção para editar:',
                choices: [
                    { name: 'Título do Livro', value: 'title' },
                    { name: 'Editora', value: 'publishingCompany' },
                    { name: 'Número de Páginas', value: 'numOfPages' },
                    { name: 'Doado?', value: 'donated' },
                    customSeparator('yellow', 13),
                    { name: 'Nome do Autor', value: 'author.firstName' },
                    { name: 'Nacionalidade do Autor', value: 'author.nationality' },
                    { name: 'Gênero Literário', value: 'author.genre' },
                    customSeparator('red', 28),
                    {
                        name: chalk.redBright('Voltar para o menu principal'),
                        value: 'backMainMenu',
                    },
                ],
                pageSize: 10,
            },

            {
                type: 'input',
                name: 'title',
                message: 'Insira o título do livro:',
                when: (answers) => answers.selectedField === 'title',
                validate: (input) => {
                    if (!/^[a-zA-Z0-9À-ÿ ]+$/.test(input)) {
                        return 'Por favor, insira um título válido.';
                    }
                    return true;
                },
            },
            {
                type: 'input',
                name: 'publishingCompany',
                message: 'Insira a editora do livro:',
                when: (answers) => answers.selectedField === 'publishingCompany',
                validate: (input) => {
                    if (!/^[a-zA-Z0-9À-ÿ ]+$/.test(input)) {
                        return 'Por favor, insira o nome da editora.';
                    }
                    return true;
                },
            },
            {
                type: 'input',
                name: 'numOfPages',
                message: 'Insira o número de páginas do livro:',
                when: (answers) => answers.selectedField === 'numOfPages',
                validate: (input) => {
                    if (!/^[0-9]+$/.test(input)) {
                        return 'Por favor, insira um número inteiro válido maior que 0.';
                    }
                    return true;
                },
            },
            {
                type: 'confirm',
                name: 'donated',
                message: 'O livro foi doado?',
                when: (answers) => answers.selectedField === 'donated',
            },
            {
                type: 'input',
                name: 'author.firstName',
                message: 'Insira o nome do autor:',
                when: (answers) => answers.selectedField === 'author.firstName',
                validate: (input) => {
                    if (!/^[a-zA-Z0-9À-ÿ ]+$/.test(input)) {
                        return 'Por favor, insira um nome válido.';
                    }
                    return true;
                },
            },
            {
                type: 'input',
                name: 'author.nationality',
                message: 'Insira a nacionalidade do autor:',
                when: (answers) => answers.selectedField === 'author.nationality',
                validate: (input) => {
                    if (!/^[a-zA-Z0-9À-ÿ ]+$/.test(input)) {
                        return 'Por favor, insira uma nacionalidade válida.';
                    }
                    return true;
                },
            },
            {
                type: 'input',
                name: 'author.genre',
                message: 'Insira o gênero literário do autor:',
                when: (answers) => answers.selectedField === 'author.genre',
                validate: (input) => {
                    if (!/^[a-zA-Z0-9À-ÿ ]+$/.test(input)) {
                        return 'Por favor, insira um gênero literário válido.';
                    }
                    return true;
                },
            },
            {
                type: 'confirm',
                name: 'confirmChange',
                message: chalk.yellow('Tem certeza de que deseja alterar este dado?'),
                when: (answers) => answers && answers.selectedField != 'backMainMenu',
            },
        ])
        .then(async (answers) => {
            if (answers.selectedField === 'backMainMenu') {
                startCode();
            } else if (answers.confirmChange) {
                changeBookValues(answers, book).then(async () => {
                    await showSpinner(
                        'Alterando os dados...',
                        2000,
                        'Dados alterados com sucesso!\n',
                        'success'
                    );
                    console.clear();
                    printBook(book, 'cyan');
                    changeBookValuesMenu(book);
                });
            } else changeBookValuesMenu(book);
        });
}

//? Confirmação para deletar o livro.

function confirmDeletion(object) {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([
                {
                    type: 'confirm',
                    name: 'confirmDeletion',
                    message: chalk.yellow(
                        'Tem certeza de que deseja excluir todos os dados deste livro?'
                    ),
                },
            ])
            .then(async (answers) => {
                if (answers.confirmDeletion) {
                    try {
                        await deleteBook(object);
                        await showSpinner(
                            'Excluindo o livro solicitado.',
                            2000,
                            'Livro excluido com sucesso!\n',
                            'success'
                        );
                    } catch {
                        await showSpinner(
                            'Excluindo o livro solicitado.',
                            2000,
                            'Não foi possivel excluir o livro!\n',
                            'error'
                        );
                    }
                }
                askUserMenuOption(() => {
                    console.log(
                        chalk.yellowBright('\n Obrigado por usar a nossa biblioteca!', '🥰👍')
                    );
                });
            });
    });
}
