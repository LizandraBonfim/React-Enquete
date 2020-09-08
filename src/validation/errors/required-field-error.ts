export class RequiredFieldError extends Error {
    constructor() {
        super();
        this.name = 'RequiredFieldError'
    }
}