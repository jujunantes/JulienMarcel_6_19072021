
/*
    Dans le fichier json, les photographes comportent les données suivantes :
    {
      "name": "Mimi Keel",
      "id": 243,
      "city": "London",
      "country": "UK",
      "tags": ["portrait", "events", "travel", "animals"],
      "tagline": "Voir le beau dans le quotidien",
      "price": 400,
      "portrait": "MimiKeel.jpg",
      "description": ""
    }
*/
class Photographe {
  constructor (attributs) {
    this.name = attributs.name || ''
    this.id = attributs.id || 0
    this.city = attributs.city || ''
    this.country = attributs.country || ''
    this.tags = attributs.tags || ''
    this.tagline = attributs.tagline || ''
    this.price = attributs.price || 0
    this.portrait = attributs.portrait || ''
    this.description = attributs.description || ''
  }
}

export default Photographe
