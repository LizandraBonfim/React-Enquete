import faker from 'faker';
import { SetStorageSpy } from '@/data/test/mock-storage';
import { LocalSaveAccessToken } from './local-save-access-token';

type SutTypes = {
    sut: LocalSaveAccessToken,
    setStorage: SetStorageSpy
}

const makeSut = (): SutTypes => {
    const setStorage = new SetStorageSpy();
    const sut = new LocalSaveAccessToken(setStorage);

    return {
        setStorage, sut
    }
}


describe('LocalSaveAccessToken', () => {
    test('Deve inserir no localStorage caso os dados estiverem corretos', async () => {
        const { sut, setStorage } = makeSut()

        const accessToken = faker.random.uuid();
        await sut.save(accessToken);

        expect(setStorage.key).toBe('accessToken');
        expect(setStorage.value).toBe(accessToken);
    })

})
