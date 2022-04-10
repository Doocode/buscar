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
    _id: number
    _name: string
    _icon: string
    _alias: string
    _type: SearchEngineType
    _queryUrl: string



    // Constructeurs
    constructor(id: number, name: string, alias: string, type: SearchEngineType, icon: string, queryUrl: string) {
        this._id = id
        this._name = name
        this._icon = icon
        this._type = type
        this._alias = alias.toLowerCase()
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
    get id(): number {
        return this._id
    }
    get name(): string {
        return this._name
    }
    get icon(): string {
        return this._icon
    }
    get alias(): string {
        return this._alias
    }
    get type(): SearchEngineType {
        return this._type
    }
    get queryUrl(): string {
        return this._queryUrl
    }



    // SETTERS
    set id(value: string | number) {
        let num = Number(value)

        // Ne pas autoriser NaN, Infinity, etc
        if (!Number.isFinite(num)) {
            this._id = 0
            return
        }

        this._id = num
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
    set alias(value: string) {
        this._alias = value.toLowerCase()
    }
    set type(value: SearchEngineType) {
        this._type = value
    }
    set queryUrl(value: string) {
        this._queryUrl = value
    }
}
