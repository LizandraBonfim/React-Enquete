import { makeLoginValidation } from "./login-validation-factory"
import { ValidationBuilder } from "@/validation/validators/builder/validation-builder";
import { ValidationComposite } from "@/validation/validators";

describe('LoginValidationFactory ', () => {
    test('Espera que o ValidationComposite returna com validações corretas. ', () => {
        const composite = makeLoginValidation();
        expect(composite).toEqual(ValidationComposite.build([
            ...ValidationBuilder.field('email').required().email().build(),
            ...ValidationBuilder.field('password').required().min(5).build()
        ]))
    })

})
