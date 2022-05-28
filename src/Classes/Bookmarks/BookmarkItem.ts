// Imports
import type BookmarkType
    from './BookmarkType'



// Représente un marque-page
export default class BookmarkItem {
    // Propriétés
    _id: number
    _name: string
    _type: BookmarkType
    _previousId?: number
    _folderId?: number
    _data: any



    // Constructeur
    constructor(id: number, name: string, type: BookmarkType, data: any, previousId?: number, folderId?: number) {
        this._id = id
        this._name = name
        this._type = type
        this._data = data
        this._previousId = previousId
        this._folderId = folderId
    }



    // GETTERS
    get id(): number {
        return this._id
    }
    get name(): string {
        return this._name
    }
    get type(): BookmarkType {
        return this._type
    }
    get data(): any {
        return this._data
    }
    get previousId(): number {
        return this._previousId
    }
    get folderId(): number {
        return this._folderId
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
    set type(value: BookmarkType) {
        this._type = value
    }
    set data(value: any) {
        this._data = value
    }
    set previousId(value: number) {
        this._previousId = value
    }
    set folderId(value: number) {
        this._folderId = value
    }
}