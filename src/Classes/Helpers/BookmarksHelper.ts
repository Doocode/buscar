import { BookmarkTypes } from "../Bookmarks/BookmarkType"

class BookmarksHelper {
    //buildChain(bookmarks: Array<BookmarkItem>) {
    buildChain(bookmarks, limit) {
        // Construire la chaine
        let chain = []
        
        // Recherche du 1er élément
        let results = bookmarks.filter(item => item.previousId == null || typeof (item.previousId) === 'undefined')
        while (results.length > 0 && chain.length < limit) {
            // Ajout de l'élément trouvé
            chain = [...chain, results[0]]

            // Recherche de l'élément suivant
            results = bookmarks.filter(item => item.previousId == results[0].id)
        }

        // Retour de la chaine
        return chain
    }

    // Rechercher les données utiles
    refreshDataFromStores(bookmarks, listSearchEngines, listSearchProfiles) {
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
}

const bookmarksHelper = new BookmarksHelper();

export default bookmarksHelper;