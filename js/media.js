/*
    Dans le fichier json, les médias comportent les données suivantes :

    { // Pour une image
      "id": 342550,
      "photographerId": 82,
      "title": "Fashion Yellow Beach",
      "image": "Fashion_Yellow_Beach.jpg",
      "tags": ["fashion"],
      "likes": 62,
      "date": "2011-12-08",
      "price": 55,
      "alt-text": ""
    }

    Ou bien :

    { // Pour une vidéo
      "id": 8328953,
      "photographerId": 82,
      "title": "Wooden Horse Sculpture",
      "video": "Art_Wooden_Horse_Sculpture.mp4",
      "tags": ["art"],
      "likes": 24,
      "date": "2011-12-08",
      "price": 100,
      "alt-text": ""
    }

*/

class Media {
  constructor (attributs) {
    this.id = attributs.id || 0
    this.photographerId = attributs.photographerId || 0
    this.title = attributs.title || ''
    this.image = attributs.image || ''
    this.video = attributs.video || ''
    this.tags = attributs.tags || ''
    this.likes = attributs.likes || 0
    this.dejaLike = 0
    this.date = attributs.date || ''
    this.price = attributs.price || 0
    this.alt_text = attributs.alt_text || ''
    this.html = '' // Servira à stocker le HTML de la carte
  }
}

export default Media
