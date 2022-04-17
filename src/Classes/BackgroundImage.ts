// Représente le type de fond d'écran
export class BackgroundImageType {
    readonly id: number
    readonly name: string
    readonly icon: string

    constructor(id: number, name: string, icon: string) {
        this.id = id
        this.name = name
        this.icon = icon
    }
}



// Représente un fond d'écran
export class BackgroundImage {
    // Propriétés
    _id: number
    _url: string
    _name: string
    _type: BackgroundImageType[]



    // Constructeurs
    constructor(id: number, name: string, url: string, type: BackgroundImageType[]) {
        this._id = id
        this._name = name
        this._type = type
        this._url = url
    }



    // GETTERS
    get id(): number {
        return this._id
    }
    get name(): string {
        return this._name
    }
    get type(): BackgroundImageType[] {
        return this._type
    }
    get url(): string {
        return this._url
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
    set type(value: BackgroundImageType[]) {
        this._type = value
    }
    set url(value: string) {
        this._url = value
    }
}
