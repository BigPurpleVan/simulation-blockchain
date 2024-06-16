const SHA256 = require('crypto-js/sha256'); // Importe la fonction de hachage SHA256 de la bibliothèque crypto-js
const dayjs = require('dayjs'); // Importe la bibliothèque dayjs pour la manipulation des dates
const { SignatureGenerator } = require('./signature'); // Importe le générateur de signature depuis le fichier signature.js

class Transaction {
    /**
     * Constructeur de la classe Transaction
     * @param {string} fromAddress - L'adresse de l'expéditeur
     * @param {string} toAddress - L'adresse du destinataire
     * @param {number} amount - Le montant de la transaction
     * @param {Date} date - La date de la transaction, par défaut à la date actuelle
     */
    constructor(fromAddress, toAddress, amount, date = dayjs()) {
        this.fromAddress = fromAddress; // Adresse de l'expéditeur
        this.toAddress = toAddress; // Adresse du destinataire
        this.amount = parseInt(amount); // Montant de la transaction, converti en entier
        this.timestamp = dayjs(date).unix(); // Timestamp UNIX de la date de la transaction
    }

    /**
     * Calcule le hachage de la transaction
     * @returns {string} Le hachage de la transaction
     */
    calculateHash() {
        const pattern = this.fromAddress + this.toAddress + this.amount; // Crée un motif avec les adresses et le montant
        return SHA256(pattern).toString(); // Retourne le hachage SHA256 du motif
    }

    /**
     * Signe la transaction avec une clé privée
     * @param {string} signingKey - La clé privée pour signer la transaction
     * @returns {Transaction} L'instance de la transaction signée
     */
    sign(signingKey) {
        const signatureGenerator = (new SignatureGenerator(signingKey)).fromPrivate(signingKey); // Crée une instance de SignatureGenerator avec la clé privée
        if (signatureGenerator.getAddress() !== this.fromAddress) {
            throw new Error('Invalid signing key'); // Lance une erreur si la clé ne correspond pas à l'adresse de l'expéditeur
        }
        this.signature = signatureGenerator.generate(this.calculateHash()); // Génère la signature de la transaction
        return this; // Retourne l'instance de la transaction
    }

    isValid() {
        // Vérifie si l'adresse de l'expéditeur et du destinataire sont présentes
        if (!this.fromAddress || !this.toAddress) return false;
            
        // Vérifie si la signature est présente
        if (!this.signature) return false;
        // Crée une instance de SignatureGenerator pour la clé publique de l'expéditeur
        const signatureGenerator = (new SignatureGenerator).fromPublic(this.fromAddress);
        // Vérifie si la signature est valide en la comparant avec le hachage de la transaction
        if (!signatureGenerator.verify(this.calculateHash(), this.signature)) {
            // Si la signature n'est pas valide, affiche le hachage et la signature pour le débogage
            console.log({
                hash: this.calculateHash(),
                signature: this.signature,
            });
            return false; // Retourne faux si la signature n'est pas valide
        }
        return true; // Retourne vrai si toutes les vérifications sont passées
    }
}

module.exports = Transaction

