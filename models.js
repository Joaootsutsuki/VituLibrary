import * as data from './datas.js';

//? Cria os objetos dos livros e dos autores.

class Author {
    #_firstName;
    #_lastName;
    #_nationality;
    #_genre;
    constructor(firstName, lastName, nationality, genre) {
        this.#_firstName = firstName;
        this.#_lastName = lastName;
        this.#_nationality = nationality;
        this.#_genre = genre;
    }

    //? Getters Methods
    get firstName() {
        return this.#_firstName;
    }
    get lastName() {
        return this.#_lastName;
    }
    get nationality() {
        return this.#_nationality;
    }
    get genre() {
        return this.#_genre;
    }

    //? Setters Methods

    set firstName(firstName) {
        this.#_firstName = firstName;
    }
    set lastName(lastName) {
        this.#_lastName = lastName;
    }
    set nationality(nationality) {
        this.#_nationality = nationality;
    }
    set genre(genre) {
        this.#_genre = genre;
    }
}

class Book {
    #_code;
    #_title;
    #_publishingCompany;
    #_numOfPages;
    #_author;
    #_donated;
    constructor(code, title, publishingCompany, numOfPages, author, donated = false) {
        this.#_code = code;
        this.#_title = title;
        this.#_publishingCompany = publishingCompany;
        this.#_numOfPages = numOfPages;
        this.#_author = author;
        this.#_donated = donated;
    }

    //? Getters Methods

    get code() {
        return this.#_code;
    }
    get title() {
        return this.#_title;
    }
    get publishingCompany() {
        return this.#_publishingCompany;
    }
    get numOfPages() {
        return this.#_numOfPages;
    }
    get author() {
        return this.#_author;
    }
    get donated() {
        return this.#_donated;
    }

    //? Setters Methods
    set title(title) {
        this.#_title = title;
    }
    set publishingCompany(publishingCompany) {
        this.#_publishingCompany = publishingCompany;
    }
    set numOfPages(numOfPages) {
        this.#_numOfPages = numOfPages;
    }
    set author(author) {
        this.#_author = author;
    }
    set donated(donated) {
        this.#_donated = donated;
    }
}
let informationBooks = {
    exactSciences: [],
    humanSciences: [],
    biomedicalSciences: [],
};

function getRandomNumber(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}

function createAuthor(i) {
    const randomNum = getRandomNumber(10);
    const firstNameAuthor = data.firstNames[i];
    const lastNameAuthor = data.lastNames[i];
    const nationalityAuthor = data.nationality[randomNum];
    return new Author(firstNameAuthor, lastNameAuthor, nationalityAuthor, 'Científico');
}

function createBook(i, author) {
    const randomNum = getRandomNumber(10);
    const randomNumOfPages = getRandomNumber(700, 100);
    const titleBook = data.bookNames[i];
    const donated = randomNum > 5;
    const publishingCompanyBook = data.namesPublishingCompany[randomNum];
    return new Book(i + 1, titleBook, publishingCompanyBook, randomNumOfPages, author, donated);
}

for (let i = 0; i < 30; i++) {
    const author = createAuthor(i);
    const book = createBook(i, author);

    if (i < 10) {
        informationBooks.exactSciences.push(book);
    } else if (i >= 10 && i < 20) {
        informationBooks.humanSciences.push(book);
    } else {
        informationBooks.biomedicalSciences.push(book);
    }
}

export default informationBooks;
