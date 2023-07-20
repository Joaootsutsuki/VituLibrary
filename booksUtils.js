import chalk from 'chalk';
import informationBooks from './models.js';

//? Realiza pesquisa em qualquer campo do livro, basta passar os parâmetros desejados.

export function findBook(searchValue, searchField, area) {
    const areaArray = informationBooks[area];
    const lowerCaseSearchValue =
        typeof searchValue === 'string' ? searchValue.toLowerCase() : searchValue;

    const foundBook = areaArray.find((element) => {
        const field =
            typeof element[searchField] === 'string'
                ? element[searchField].toLowerCase()
                : element[searchField];
        return field === lowerCaseSearchValue;
    });

    return foundBook;
}

//? Realiza a exibição dos livros doados. Se parâmetros forem fornecidos, busca os livros doados com o número de páginas entre os valores selecionados.

export function listDonatedBooks(minPages, maxPages) {
    const areas = Object.keys(informationBooks);
    areas.forEach((area) => {
        let textColor;
        if (area === 'exactSciences') {
            textColor = 'cyan';
        } else if (area === 'humanSciences') {
            textColor = 'yellow';
        } else {
            textColor = 'magenta';
        }

        const array = informationBooks[area];
        const donatedBooks = array.filter((element) => {
            const isDonated = element.donated;
            const isWithinPagesRange =
                (minPages === undefined || element.numOfPages >= minPages) &&
                (maxPages === undefined || element.numOfPages <= maxPages);
            return isDonated && isWithinPagesRange;
        });

        donatedBooks.forEach((book) => {
            printBook(book, textColor);
        });
    });
}

//? Apenas realiza a exibição do livro.

export function printBook(element, textColor) {
    console.log(chalk[textColor]('\nCódigo do Livro: ') + element.code);
    console.log(chalk[textColor]('Título do Livro: ') + element.title);
    console.log(chalk[textColor]('Editora: ') + element.publishingCompany);
    console.log(chalk[textColor]('Número de Páginas: ') + element.numOfPages);
    console.log(chalk[textColor]('Doado?: ') + element.donated);
    console.log(
        chalk[textColor]('\nNome do Autor: ') +
            element.author.firstName +
            ' ' +
            element.author.lastName
    );
    console.log(chalk[textColor]('Nacionalidade do Autor: ') + element.author.nationality);
    console.log(chalk[textColor]('Gênero Literário: ') + element.author.genre);

    console.log(chalk.red('-------------------------------'));
}

//? Apenas realiza a exibição dos livros.
export function printBooks() {
    console.log(
        chalk.bgGreen(
            'Legenda: \n A cor ciano são os livros de Exatas. \n A cor amarela são os livros de Humanas. \n A cor magenta são os livros de Biomedicina.\n'
        )
    );

    for (const key in informationBooks) {
        let textColor;
        const arrayBooks = informationBooks[key];
        if (key === 'exactSciences') {
            textColor = 'cyan';
        } else if (key === 'humanSciences') {
            textColor = 'yellow';
        } else {
            textColor = 'magenta';
        }

        arrayBooks.forEach((element) => {
            printBook(element, textColor);
        });
    }

    console.log(
        chalk.bgGreen('Melhore sua experiência começando a olhar a lista de cima para baixo.')
    );
}

//? Muda os valores escolhidos do livro.

export function changeBookValues(data, book) {
    return new Promise((resolve) => {
        const field = data.selectedField;
        const changedValue = data[field];
        book[field] = changedValue;
        resolve();
    });
}

//? Deleta os livros.

export function deleteBook(object) {
    return new Promise((resolve, reject) => {
        const bookCode = object.book.code;
        const area = object.area;
        const arrayOfBook = informationBooks[area];
        const indexBookToDelete = arrayOfBook.findIndex((book) => book.code === bookCode);
        if (indexBookToDelete !== -1) {
            arrayOfBook.splice(indexBookToDelete, 1);
            resolve();
        } else reject();
    });
}
