
class Utils {
    stringContains(text:string, search:string) {
        // TODO: Echapper les accents
        return text.toLowerCase().indexOf(search.toLowerCase()) > -1
    }

    // Indique si le caractère est un caractère spécial pour regex
    isRegexSpecialCharacter(text: string) {
        // https://www.threesl.com/blog/special-characters-regular-expressions-escape/
        const REGEX_CHARACTERS = [
            '\\', '^', '$', '.', '|', '?', '*', '+',
            '(' , ')', '[', ']', '{', '}', '-'
        ]
        return REGEX_CHARACTERS.indexOf(text) > -1
    }
}

const utils = new Utils();

export default utils;