

export class UnexpectedError extends Error {
    constructor() {
        super('Ocorreu um erro. Tente mais tarde.');
        this.name = 'UnexpectedError';
    }
}