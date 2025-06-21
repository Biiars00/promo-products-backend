import { injectable } from 'tsyringe';
import { ErrorMiddleware } from '../../middlewares/error.middleware';
import IValidateStringRegexService from '../../interfaces/services/validateStringRegex/validateStringRegex.interface';

@injectable()
export class ValidateStringRegexService implements IValidateStringRegexService {
  constructor() {}

  validadeStringRegex(name: string, regex: any, limitInitialLetters: number, limitFinalLetters: number): string {
    const validateName = name.trim().replace(/\s+/g, ' ').toLowerCase();
    const nameRegex = regex;

    if (validateName.length < limitInitialLetters || validateName.length > limitFinalLetters) {
        throw new ErrorMiddleware(400, `Name must be between ${limitInitialLetters} and ${limitFinalLetters} characters`);
    }

    if (!nameRegex.test(validateName)) {
        throw new ErrorMiddleware(400, 'Name contains invalid characters');
    }

    return validateName;
  }
}
