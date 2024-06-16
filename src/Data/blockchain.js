const dayjs = require('dayjs') // Importe la bibliothèque dayjs pour manipuler les dates
const Log = require('./log') // Importe le module de journalisation personnalisé
const Block = require('./block') // Importe la classe Block
const Transaction = require('./transaction') // Importe la classe Transaction
const { KeyGenerator } = require('./signature') // Importe le générateur de clés pour la signature

// Définit la classe Blockchain
class Blockchain {
  /**
   * Crée une nouvelle blockchain
   */
  constructor() {
    Log.add('[Blockchain] Init') // Ajoute un message de journalisation pour l'initialisation

    // Définit la difficulté du proof of work et la récompense de minage
    this.blockProofOfWorkDifficulty = 2
    this.blockMineReward = 1

    // Initialise la chaîne et les transactions en attente
    this.chain = []
    this.pendingTransactions = []

    // Génère une clé pour le système et l'ajoute au journal
    Log.add('[Blockchain] Generating key for system')
    this.system = new KeyGenerator().generate()
    Log.add('[Blockchain] Generate complete', this.system)

    // Crée le bloc genesis et l'ajoute à la chaîne
    Log.add('[Blockchain] Generate genesis block')
    this.chain.push(new Block([], dayjs().toDate(), '0'))
  }

  /**
   * Récupère le dernier bloc de la blockchain
   * @returns {Block}
   */
  getLastBlock() {
    return this.chain[this.chain.length - 1]
  }

  /**
   * Ajoute un nouveau bloc à la blockchain
   *
   * @param  {Block} block
   * @return {void}
   */
  addBlock(block) {
    block.previousHash = this.getLastBlock().hash // Définit le hachage précédent du bloc
    block.hash = block.calculateHash() // Calcule le nouveau hachage du bloc
    this.chain.push(block) // Ajoute le bloc à la chaîne
  }

  /**
   * Ajoute une nouvelle transaction à la blockchain
   * @param  {Transaction} transaction
   * @return {void}
   */
  addTransaction(transaction) {
    Log.add(`[Blockchain] Adding new transaction`, transaction) // Journalise l'ajout de la transaction
    this.pendingTransactions.push(transaction) // Ajoute la transaction aux transactions en attente
  }

  /**
   * Mine la blockchain
   * @param  {string} mineAddress
   * @returns {Promise}
   */
  mine(mineAddress) {
    Log.add(`[Blockchain] Starting mining with miner ${mineAddress}`) // Journalise le début du minage
    return new Promise((resolve, reject) => {
      // Ajoute une transaction de récompense pour le mineur
      this.addTransaction(
        new Transaction(
          this.system.publicKey,
          mineAddress,
          this.blockMineReward
        ).sign(this.system.privateKey)
      )
      const block = new Block(this.pendingTransactions, dayjs().toDate()) // Crée un nouveau bloc avec les transactions en attente
      block.previousHash = this.getLastBlock().hash // Définit le hachage précédent du bloc

      // Mine le bloc avec la difficulté définie
      block.mine(this.blockProofOfWorkDifficulty, this.pendingTransactions).then(() => {
        this.chain.push(block) // Ajoute le bloc miné à la chaîne
        this.pendingTransactions = [] // Réinitialise les transactions en attente
        Log.add(`[Blockchain] Mining complete`) // Journalise la fin du minage
        resolve(this) // Résout la promesse avec la blockchain mise à jour
      })
    })
  }

  /**
   * Vérifie si la blockchain est valide
   * @returns {boolean}
   */
  isValid() {
    // Vérifie chaque bloc et chaque transaction pour s'assurer de la validité de la chaîne
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      if (currentBlock.previousHash !== previousBlock.hash) return false
      if (currentBlock.hash !== currentBlock.calculateHash()) return false

      // Vérifie la validité de chaque transaction dans le bloc
      for (let i = 1; i < this.chain.length; i++) {
        const transactions = this.chain[i].data
        for (let j = 0; j < transactions.length; j++) {
          if (!transactions[j].isValid()) return false
        }
      }
    }

    // Retourne vrai si toutes les vérifications sont passées
    return true
  }

  /**
   * Obtient le solde d'une adresse donnée
   * @param  {string} address
   */
  getBalance(address) {
    let balance = 0 // Initialise le solde à 0
    // Parcourt chaque bloc et chaque transaction pour calculer le solde
    for (let i = 0; i < this.chain.length; i++) {
      const block = this.chain[i]
      for (let j = 0; j < block.data.length; j++) {
        const transaction = block.data[j]
        if (transaction.fromAddress === address) {
          balance -= transaction.amount // Soustrait le montant si l'adresse est l'expéditeur
        }
        if (transaction.toAddress === address) {
          balance += transaction.amount // Ajoute le montant si l'adresse est le destinataire
        }
      }
    }
    return balance // Retourne le solde calculé
  }

  /**
   * Imprime la blockchain
   */
  print() {
    // console.log(JSON.stringify(this.chain, null, 4)) // Imprime la chaîne au format JSON
  }
}

module.exports = Blockchain // Exporte la classe Blockchain