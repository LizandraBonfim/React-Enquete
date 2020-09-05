import { Authentication, AuthenticationParams } from "@/domain/usecases";
import { MockAccountModel } from "@/domain/test";
import { AccountModel } from "@/domain/models";

export class AuthenticationSpy implements Authentication {
    account = MockAccountModel();
    params: AuthenticationParams
    callsCount = 0;

    async auth(params: AuthenticationParams): Promise<AccountModel> {
        this.params = params;
        this.callsCount++
        return Promise.resolve(this.account);
    }
}