// Représente le type de moteur de recherche
export class SearchEngineType {
    readonly id: number
    readonly name: string
    readonly icon: string

    constructor(id: number, name: string, icon: string) {
        this.id = id
        this.name = name
        this.icon = icon
    }
}



// Représente un moteur de recherche
export class SearchEngine {
    // Propriétés
    id: number
    _name: string
    _icon: string
    _type: SearchEngineType
    _queryUrl: string

    // Constructeurs
    constructor(id: number, name: string, type: SearchEngineType, icon: string, queryUrl: string) {
        this.id = id
        this._name = name
        this._icon = icon
        this._type = type
        this._queryUrl = queryUrl
    }



    // METHODES
    // Place des mots-clés dans une url de recherche
    parseQuery(query: string) {
        // TODO: Retourner une requête GET/POST
        // Echapper les caractères spéciaux (%, =, ?) dans la requête
        let encoded = encodeURI(query)

        // Retour de l'url avec la requête
        return this._queryUrl.replace("%query%", encoded)
    }



    // GETTERS
    getId(): number {
        return this.id
    }
    get name(): string {
        return this._name
    }
    get icon(): string {
        return this._icon
    }
    get type(): SearchEngineType {
        return this._type
    }
    get queryUrl(): string {
        return this._queryUrl
    }



    // SETTERS
    setId(value: string | number) {
        let num = Number(value)

        // Ne pas autoriser NaN, Infinity, etc
        if (!Number.isFinite(num)) {
            this.id = 0
            return
        }

        this.id = num
    }
    set name(value: string) {
        // Ne pas autoriser une chaine vide
        if (value.length < 1) {
            this._name = "(Sans nom)"
            return
        }

        this._name = value
    }
    set icon(value: string | null) {
        this._icon = value
    }
    set type(value: SearchEngineType) {
        this._type = value
    }
    set queryUrl(value: string) {
        this._queryUrl = value
    }
}
