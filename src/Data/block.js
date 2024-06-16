const SHA256 = require('crypto-js/sha256') // Importe la fonction de hachage SHA256 de la bibliothèque crypto-js
const dayjs = require('dayjs') // Importe la bibliothèque dayjs pour la manipulation des dates
const Log = require('./log') // Importe le module Log personnalisé pour la journalisation

// Définit la classe Block
class Block {
  /**
   * Constructeur de la classe Block
   * @param {Object} data - Les données à stocker dans le bloc
   * @param {Date} date - La date de création du bloc
   * @param {string} previousHash - Le hachage du bloc précédent dans la chaîne
   */
  constructor(data, date, previousHash = '') {
    this.data = data // Données à stocker dans le bloc
    this.timestamp = dayjs(date).unix() // Convertit la date en timestamp UNIX avec dayjs
    this.hash = undefined // Initialise le hachage comme indéfini
    this.previousHash = previousHash // Hachage du bloc précédent
    this.hash = this.calculateHash() // Calcule le hachage du bloc
    this.nonce = 0 // Nonce utilisé pour le minage
    this.options = {
      log: true // Option pour activer la journalisation
    }
  }

  /**
   * Calcule le hachage du bloc en utilisant SHA256
   * @returns {string} Le hachage du bloc
   */
  calculateHash() {
    const payload = JSON.stringify(this.data) // Convertit les données en chaîne de caractères
    const pattern = this.previousHash + this.timestamp + this.nonce + payload // Concatène previousHash, timestamp, nonce et données
    return SHA256(pattern).toString() // Retourne le hachage SHA256 du motif
  }

  /**
   * Mine le bloc en trouvant un hachage qui répond aux critères de difficulté
   * @param {number} difficulty - Le niveau de difficulté du processus de minage
   * @returns {Promise} Une promesse qui se résout lorsque le bloc est miné avec succès
   */
  mine(difficulty = 2) {
    return new Promise((resolve, reject) => {
      const start = Date.now() // Enregistre l'heure de début
      const intervalId = setInterval(() => {
        const current = Date.now() // Obtient l'heure actuelle
        this.nonce++ // Incrémente le nonce
        this.hash = this.calculateHash() // Recalcule le hachage avec le nouveau nonce
        const currentTime = Math.floor((current - start) / 1000) // Calcule le temps écoulé en secondes
        if (this.options.log) console.log(`[Block] Minage du bloc - hachage généré et trouvé ${this.hash} | ${currentTime}s | nonce ${this.nonce}`) // Journalise la progression du minage
        if (this.hash.slice(0, difficulty) === '0'.repeat(difficulty)) { // Vérifie si le hachage répond aux critères de difficulté
          clearInterval(intervalId) // Arrête le minage
          const end = Date.now() // Enregistre l'heure de fin
          const time = (end - start) / 1000 // Calcule le temps total de minage
          if (this.options.log) {
            console.log(`[Block] Minage du bloc - Succès en ${time}s avec nonce ${this.nonce}`) // Journalise le message de succès
            Log.add(`[Block] Minage du bloc - Succès en ${time}s avec nonce ${this.nonce}`) // Ajoute le message de succès au journal
          }
          resolve(this) // Résout la promesse avec le bloc miné
        }
      }, 10) // Définit l'intervalle à 10 millisecondes
    })
  }
}

module.exports = Block // Exporte la classe Block