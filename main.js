import { asciiText } from './asciiText.js';
import { mainMenuInput } from './menu.js';

//? Função responsavel por começar o menu.

export async function startCode() {
    console.clear();
    await asciiText();
    mainMenuInput();
}

startCode();
