// Représente le type de moteur de recherche
export default class SearchEngineType {
    readonly id: number
    readonly name: string
    readonly icon: string

    constructor(id: number, name: string, icon: string) {
        this.id = id
        this.name = name
        this.icon = icon
    }
}



// Types de moteurs de recherche
export const SearchEngineTypes = {
    web: new SearchEngineType(1, "Web", "web"),
    images: new SearchEngineType(2, "Images", "image"),
    videos: new SearchEngineType(3, "Videos", "play"),
    music: new SearchEngineType(4, "Musique", "music"),
    files: new SearchEngineType(5, "Fichiers", "file"),
    mails: new SearchEngineType(6, "Mails", "mail"),
    news: new SearchEngineType(7, "Presse", "blog"),
    shop: new SearchEngineType(8, "Achats", "shopping"),
}