const elliptic = require('elliptic') // Importe la bibliothèque elliptic pour la cryptographie

// Définit la classe KeyGenerator pour générer des paires de clés
class KeyGenerator {
    // Génère une paire de clés publique/privée
    generate() {
        const EC = new (elliptic.ec)('secp256k1') // Utilise la courbe elliptique secp256k1
        const key = EC.genKeyPair() // Génère la paire de clés
        return {
            privateKey: key.getPrivate('hex'), // Renvoie la clé privée en hexadécimal
            publicKey: key.getPublic('hex'), // Renvoie la clé publique en hexadécimal
        }
    }
}

// Définit la classe SignatureGenerator pour générer et vérifier des signatures
class SignatureGenerator {
    constructor() {
        this.key = undefined // Initialise la clé à indéfini
    }

    // Charge une clé privée pour la signature
    fromPrivate(privateKey) {
        this.key = (new (elliptic.ec)('secp256k1')).keyFromPrivate(privateKey, 'hex') // Charge la clé privée
        return this // Permet le chaînage des méthodes
    }

    // Charge une clé publique pour la vérification
    fromPublic(publicKey) {
        this.key = (new (elliptic.ec)('secp256k1')).keyFromPublic(publicKey, 'hex') // Charge la clé publique
        return this // Permet le chaînage des méthodes
    }

    // Renvoie l'adresse publique associée à la clé
    getAddress() {
        return (this.key) ? this.key.getPublic('hex') : undefined // Renvoie l'adresse publique en hexadécimal
    }

    // Génère une signature pour un hachage donné
    generate(hash) {
        const signature = this.key.sign(hash, 'base64') // Signe le hachage
        return signature.toDER('hex') // Renvoie la signature en format DER hexadécimal
    }

    // Vérifie une signature pour un hachage donné
    verify(hash, signature) {
        return this.key.verify(hash, signature) // Vérifie la signature
    }
}

exports.KeyGenerator = KeyGenerator // Exporte la classe KeyGenerator
exports.SignatureGenerator = SignatureGenerator // Exporte la classe SignatureGenerator