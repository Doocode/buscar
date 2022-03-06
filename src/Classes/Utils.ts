
class Utils {
    stringContains(text:string, search:string) {
        // TODO: Echapper les accents
        return text.toLowerCase().indexOf(search.toLowerCase()) > -1
    }
}

const utils = new Utils();

export default utils;