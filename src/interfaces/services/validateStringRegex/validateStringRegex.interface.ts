interface IValidateStringRegexService {
  validadeStringRegex(name: string, regex: any, limitInitialLetters: number, limitFinalLetters: number): string;
}

export default IValidateStringRegexService;
