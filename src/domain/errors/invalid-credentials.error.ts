

export class InvalidCredentialsError extends Error {
    constructor() {
        super('Credentiais invalidas');
        this.name = 'InvalidCredentialsError';
    }
}