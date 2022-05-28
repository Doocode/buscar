// Type de marque-page
export default class BookmarkType {
    readonly id: number
    readonly name: string
    readonly icon: string

    constructor(id: number, name: string, icon: string) {
        this.id = id
        this.name = name
        this.icon = icon
    }
}


// Les types de marque-page
let t_id = 1
export const BookmarkTypes = {
    directory: new BookmarkType(t_id++, "Répertoire", 'folder'),
    website: new BookmarkType(t_id++, "Site web", 'web'),
    searchEngine: new BookmarkType(t_id++, "Moteur de recherche", 'search'),
    searchProfile: new BookmarkType(t_id++, "Profile de recherche", 'search_group'),
}