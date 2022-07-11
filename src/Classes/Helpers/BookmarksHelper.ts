import type BookmarkItem from '../Bookmarks/BookmarkItem'
import { BookmarkTypes } from '../Bookmarks/BookmarkType'
import type SearchEngine from '../SearchEngine/SearchEngine'



class BookmarksHelper {
    buildChain(bookmarks: Array<BookmarkItem>, limit: number, folderId?: number) {
    //buildChain(bookmarks, limit) {
        // Callback pour vérifier si l'item fait partie du folder
        const isInFolder = item => item.folderId == folderId
    
        // Construire la chaine
        let chain = []
        
        // Recherche du 1er élément
        let results = bookmarks.filter(item => isInFolder(item) && (item.previousId == null || typeof (item.previousId) === 'undefined'))
        while (results.length > 0 && chain.length < limit) {
            // Ajout de l'élément trouvé
            chain = [...chain, results[0]]

            // Recherche de l'élément suivant
            results = bookmarks.filter(item => isInFolder(item) && item.previousId == results[0].id)
        }

        // Retour de la chaine
        return chain
    }



    // Rechercher les données utiles
    refreshDataFromStores(bookmarks: Array<BookmarkItem>, listSearchEngines: Array<SearchEngine>, listSearchProfiles) {
    //refreshDataFromStores(bookmarks, listSearchEngines, listSearchProfiles) {
        return bookmarks.map(bk => {
            let results = []

            switch (bk.type) {
                case BookmarkTypes.searchEngine:
                    results = listSearchEngines
                    .filter(item => item.id == bk.data.id)
                    if (results.length > 0) {
                        bk.data.icon = results[0].icon
                        bk.data.name = results[0].name
                        //bk.name = results[0].name
                    }
                    break
                case BookmarkTypes.searchProfile:
                    results = listSearchProfiles
                    .filter(item => item.id == bk.data.id)
                    if (results.length > 0) {
                        bk.data.icon = results[0].icon
                        bk.data.name = results[0].name
                        bk.data.searchEngines = results[0].searchEnginesIds
                    }
                    break
            }
            return bk
        })
    }



    // Formatter un dossier pour une adresse URL
    formatFolderForUrl(item: BookmarkItem) {
        let str = item.id + '/' + item.name.toLowerCase()
            .replace(/ /g, '-')
            .replace(/\//g, '-').replace(/\\/g, '-')
            .replaceAll('\'', '-')
            .replaceAll('"', '-')
            .replaceAll('=', '-')
            .replaceAll('#', '-').replaceAll('%', '-').replaceAll('&', '-').replaceAll('@', '-')
            .replaceAll(',', '-').replaceAll(';', '-').replaceAll('.', '-').replaceAll(':', '-')
            .replaceAll('+', '-').replaceAll('*', '-')
            .replaceAll('(', '-').replaceAll('[', '-').replaceAll('{', '-')
            .replaceAll(')', '-').replaceAll(']', '-').replaceAll('}', '-')
            .replaceAll('à', 'a').replaceAll('â', 'a').replaceAll('ä', 'a')
            .replaceAll('ì', 'i').replaceAll('î', 'i').replaceAll('ï', 'i')
            .replaceAll('ò', 'o').replaceAll('ô', 'o').replaceAll('ö', 'o')
            .replaceAll('ù', 'u').replaceAll('û', 'u').replaceAll('ü', 'u')
            .replaceAll('é', 'e').replaceAll('è', 'e').replaceAll('ê', 'e').replaceAll('ë', 'e')

        while (str.indexOf('--') > -1)
            str = str.replace('--', '-')

        return str
    }
}

const bookmarksHelper = new BookmarksHelper();

export default bookmarksHelper;