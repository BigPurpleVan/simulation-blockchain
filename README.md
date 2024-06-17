# Simulateur de blockchain

Un petit emulateur de blockchain qui tourne sur navigateur, a simple but d'illustration et de mise en pratique pour notre projet d'étude.

## Disclamer

Ce travail est basé sur le travail de [viandwi24](https://github.com/viandwi24/blockchain-simulation), nous avons repris ses fichiers de simulation et avons recréer notre propre interface par dessus, un grand merci a lui.

## Lien du projet

Pour voir le projet directement, vous pouvez clique sur le lien suivant : [Lien du projet](https://bigpurplevan.github.io/simulation-blockchain/)

## Installation locale
```
# Cloner le dépôt
git clone https://github.com/BigPurpleVan/simulation-blockchain.git

# Se déplacer dans le répertoire du projet
simulation-blockchain

# Installer les dépendances
npm install

# Démarrer l'application
npm start

```

## Structure du projet
```
.
├── src
│   ├── index.js       # Fichier Racines
│   ├── Pages          # Composants de l'application
│   ├── Data           # Fichiers contenant les algorithme de cryptographie/blockchain
│   └── Icons          # Icones importées
├── package.json       # Fichier de configuration npm
└── README.md          # Documentation du projet
```

## Fonctionnalités

## Simulation
Tout ce passe dans le dossier Data du projet

### block.js

Ce document explique le code JavaScript d'une classe `Block` utilisée pour la création et le minage de blocs dans un contexte de blockchain.

#### Importation des Modules
Le code commence par importer les modules nécessaires :
- `crypto-js/sha256` pour calculer le hash.
- `dayjs` pour gérer les dates.
- `./log` pour la journalisation.

```javascript
const SHA256 = require('crypto-js/sha256')
const dayjs = require('dayjs')
const Log = require('./log')
```

#### Définition de la Classe `Block`

La classe `Block` représente un bloc dans la blockchain.

```javascript
class Block {
  constructor(data, date, previousHash = '') {
    this.data = data
    this.timestamp = dayjs(date).unix()
    this.hash = undefined
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
    this.options = {
      log: true
    }
  }
```

- `data` : les données du bloc.
- `timestamp` : le moment de la création du bloc en format Unix, basé sur la date fournie.
- `hash` : le hash du bloc, initialisé puis calculé.
- `previousHash` : le hash du bloc précédent, par défaut une chaîne vide.
- `nonce` : un nombre utilisé pour le minage.
- `options` : options de configuration, ici pour activer la journalisation.

#### Calcul du Hash

La méthode `calculateHash` calcule le hash du bloc en utilisant les données, le hash précédent, le timestamp et le nonce.

```javascript
  calculateHash() {
    const payload = JSON.stringify(this.data)
    const pattern = this.previousHash + this.timestamp + this.nonce + payload
    return SHA256(pattern).toString()
  }
```

#### Minage du Bloc

La méthode `mine` effectue le minage du bloc, c'est-à-dire la recherche d'un hash commençant par un certain nombre de zéros (défini par la difficulté).

```javascript
  mine(difficulty = 2, transactions = []) {
    return new Promise((resolve, reject) => {
      const start = Date.now()
      const intervalId = setInterval(() => {
        const current = Date.now()
        this.nonce++
        this.hash = this.calculateHash()
        const currentTime = Math.floor((current - start) / 1000)
        if (this.options.log) console.log(`[Block] Mining Block - generate hash and found ${this.hash} | ${currentTime}s | nonce ${this.nonce}`)
        if (this.hash.slice(0, difficulty) === '0'.repeat(difficulty)) {
          clearInterval(intervalId)
          const end = Date.now()
          const time = (end - start) / 1000
        this.transactions = transactions
          if (this.options.log) {
            console.log(`[Block] Mining Block - Success in ${time}s with nonce ${this.nonce}`)
            Log.add(`[Block] Mining Block - Success in ${time}s with nonce ${this.nonce}`)
          }
          resolve(this)
        }
      }, 10)
    })
  }
}
```

- La méthode retourne une promesse.
- Elle utilise `setInterval` pour répéter le processus de minage toutes les 10 millisecondes.
- `nonce` est incrémenté à chaque itération.
- Le hash est recalculé avec la nouvelle valeur de nonce.
- Si le hash généré commence par le nombre requis de zéros (`difficulty`), le processus s'arrête et le bloc est considéré comme miné avec succès.
- Finalement on récupère les transactions dans le blocs pour les archiver via l'array `this.transactions`

#### Exportation de la Classe

Enfin, la classe `Block` est exportée pour être utilisée ailleurs dans le projet.

```javascript
module.exports = Block
```

### Résumé

Ce code implémente une classe `Block` pour une blockchain, capable de calculer son propre hash et de se miner en recherchant un hash valide. Le minage utilise une méthode simple de "proof of work" où un nonce est incrémenté jusqu'à ce qu'un hash valide soit trouvé.

### blockchain.js

Ce document explique le code JavaScript d'une classe `Blockchain` utilisée pour créer et gérer une blockchain. 

#### Importation des Modules
Le code commence par importer les modules nécessaires :
- `dayjs` pour gérer les dates.
- `./log` pour la journalisation.
- `./block` pour la classe `Block`.
- `./transaction` pour la classe `Transaction`.
- `./signature` pour la génération de clés.

```javascript
const dayjs = require('dayjs')
const Log = require('./log')
const Block = require('./block')
const Transaction = require('./transaction')
const { KeyGenerator } = require('./signature')
```

#### Définition de la Classe `Blockchain`

La classe `Blockchain` représente une blockchain, avec des méthodes pour ajouter des blocs, valider la chaîne et gérer les transactions.

```javascript
class Blockchain {
  /**
   * Create a Blockchain
   */
  constructor() {
    Log.add('[Blockchain] Init')

    // Difficulté de la preuve de travail et récompense de minage
    this.blockProofOfWorkDifficulty = 2
    this.blockMineReward = 1

    // Chaîne de blocs et transactions en attente
    this.chain = []
    this.pendingTransactions = []

    // Système de génération de clé
    Log.add('[Blockchain] Generating key for system')
    this.system = new KeyGenerator().generate()
    Log.add('[Blockchain] Generate complete', this.system)

    // Création du bloc genesis
    Log.add('[Blockchain] Generate genesis block')
    this.chain.push(new Block([], dayjs().toDate(), '0'))
  }
```

- `blockProofOfWorkDifficulty` : la difficulté de la preuve de travail.
- `blockMineReward` : la récompense de minage.
- `chain` : la chaîne de blocs.
- `pendingTransactions` : les transactions en attente.
- `system` : les clés du système générées par `KeyGenerator`.

#### Méthodes de la Classe `Blockchain`

##### Récupérer le Dernier Bloc

Cette méthode retourne le dernier bloc de la chaîne.

```javascript
  getLastBlock() {
    return this.chain[this.chain.length - 1]
  }
```

##### Ajouter un Nouveau Bloc

Cette méthode ajoute un nouveau bloc à la chaîne après avoir calculé son hash.

```javascript
  addBlock(block) {
    block.previousHash = this.getLastBlock().hash
    block.hash = block.calculateHash()
    this.chain.push(block)
  }
```

##### Ajouter une Transaction

Cette méthode ajoute une nouvelle transaction à la liste des transactions en attente.

```javascript
  addTransaction(transaction) {
    Log.add(`[Blockchain] Adding new transaction`, transaction)
    this.pendingTransactions.push(transaction)
  }
```

##### Miner un Bloc

Cette méthode mine un bloc, c'est-à-dire qu'elle crée un nouveau bloc à partir des transactions en attente, et le récompense de minage est attribué à une adresse spécifique.

```javascript
  mine(mineAddress, , this.pendingTransactions) {
    Log.add(`[Blockchain] Starting mining with miner ${mineAddress}`)
    return new Promise((resolve, reject) => {
      this.addTransaction(
        new Transaction(
          this.system.publicKey,
          mineAddress,
          this.blockMineReward
        ).sign(this.system.privateKey)
      )
      const block = new Block(this.pendingTransactions, dayjs().toDate())
      block.previousHash = this.getLastBlock().hash

      block.mine(this.blockProofOfWorkDifficulty).then(() => {
        this.chain.push(block)
        this.pendingTransactions = []
        Log.add(`[Blockchain] Mining complete`)
        resolve(this)
      })
    })
  }
```

##### Vérifier la Validité de la Blockchain

Cette méthode vérifie si la chaîne est valide en comparant les hashes et en validant chaque transaction.

```javascript
  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      if (currentBlock.previousHash !== previousBlock.hash) return false
      if (currentBlock.hash !== currentBlock.calculateHash()) return false

      for (let i = 1; i < this.chain.length; i++) {
        const transactions = this.chain[i].data
        for (let j = 0; j < transactions.length; j++) {
          if (!transactions[j].isValid()) return false
        }
      }
    }
    return true
  }
```

##### Obtenir le Solde d'une Adresse

Cette méthode calcule le solde d'une adresse donnée en parcourant toutes les transactions de la chaîne.

```javascript
  getBalance(address) {
    let balance = 0
    for (let i = 0; i < this.chain.length; i++) {
      const block = this.chain[i]
      for (let j = 0; j < block.data.length; j++) {
        const transaction = block.data[j]
        if (transaction.fromAddress === address) {
          balance -= transaction.amount
        }
        if (transaction.toAddress === address) {
          balance += transaction.amount
        }
      }
    }
    return balance
  }
```
#### Exportation de la Classe

Enfin, la classe `Blockchain` est exportée pour être utilisée ailleurs dans le projet.

```javascript
module.exports = Blockchain
```

### Résumé

Ce code implémente une classe `Blockchain` avec des fonctionnalités pour ajouter des blocs, gérer des transactions, miner des blocs, vérifier la validité de la chaîne, et calculer le solde des adresses. Les blocs sont minés en résolvant des preuves de travail, et les transactions sont validées pour garantir l'intégrité de la blockchain.


### Explication du Code

Ce document explique le code JavaScript d'une classe `Transaction` utilisée pour créer et gérer des transactions dans une blockchain.

#### Importation des Modules
Le code commence par importer les modules nécessaires :
- `crypto-js/sha256` pour calculer le hash.
- `dayjs` pour gérer les dates.
- `./signature` pour la génération et la vérification des signatures.

```javascript
const SHA256 = require('crypto-js/sha256');
const dayjs = require('dayjs');
const { SignatureGenerator } = require('./signature');
```

#### Définition de la Classe `Transaction`

La classe `Transaction` représente une transaction entre deux adresses sur la blockchain.

```javascript
class Transaction {
    constructor(fromAddress, toAddress, amount, date = dayjs()) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = parseInt(amount);
        this.timestamp = dayjs(date).unix();
    }
```

- `fromAddress` : l'adresse de l'expéditeur.
- `toAddress` : l'adresse du destinataire.
- `amount` : le montant de la transaction.
- `timestamp` : le moment de la transaction en format Unix.

#### Calcul du Hash

La méthode `calculateHash` calcule le hash de la transaction en utilisant les adresses de l'expéditeur et du destinataire ainsi que le montant.

```javascript
    calculateHash() {
        const pattern = this.fromAddress + this.toAddress + this.amount;
        return SHA256(pattern).toString();
    }
```

#### Signature de la Transaction

La méthode `sign` signe la transaction avec la clé privée de l'expéditeur. Elle vérifie d'abord que la clé de signature correspond à l'adresse de l'expéditeur.

```javascript
    sign(signingKey) {
        const signatureGenerator = (new SignatureGenerator(signingKey)).fromPrivate(signingKey);
        if (signatureGenerator.getAddress() !== this.fromAddress) {
            throw new Error('Invalid signing key');
        }
        this.signature = signatureGenerator.generate(this.calculateHash());
        return this;
    }
```

- `signingKey` : la clé privée utilisée pour signer la transaction.
- La méthode génère un objet `SignatureGenerator` pour créer la signature.
- Si l'adresse de la clé de signature ne correspond pas à l'adresse de l'expéditeur, une erreur est levée.
- La signature est générée à partir du hash de la transaction et ajoutée à la transaction.

#### Validation de la Transaction

La méthode `isValid` vérifie si la transaction est valide en contrôlant les adresses et la signature.

```javascript
    isValid() {
        // check address
        if (!this.fromAddress || !this.toAddress) return false;

        // Check signature
        if (!this.signature) return false;
        const signatureGenerator = (new SignatureGenerator).fromPublic(this.fromAddress);
        if (!signatureGenerator.verify(this.calculateHash(), this.signature)) {
            console.log({
                hash: this.calculateHash(),
                signature: this.signature,
            });
            return false;
        }
        return true;
    }
```

- La méthode vérifie que les adresses de l'expéditeur et du destinataire existent.
- Elle vérifie que la transaction possède une signature.
- Un objet `SignatureGenerator` est créé à partir de l'adresse publique de l'expéditeur.
- La signature est vérifiée pour s'assurer qu'elle correspond au hash de la transaction.
- Si une des vérifications échoue, la transaction est considérée comme invalide.

#### Exportation de la Classe

Enfin, la classe `Transaction` est exportée pour être utilisée ailleurs dans le projet.

```javascript
module.exports = Transaction;
```

### Résumé

Ce code implémente une classe `Transaction` pour une blockchain, capable de calculer son propre hash, de se signer avec une clé privée, et de vérifier la validité de la transaction en contrôlant les adresses et la signature. Les transactions sont sécurisées grâce à l'utilisation de la cryptographie pour garantir l'intégrité et l'authenticité des données.


### Explication du Code

Ce document explique le code JavaScript de deux classes `KeyGenerator` et `SignatureGenerator`, utilisées pour générer des clés et des signatures cryptographiques dans le contexte d'une blockchain.

#### Importation des Modules
Le code commence par importer le module nécessaire :
- `elliptic` pour les opérations cryptographiques utilisant la courbe elliptique `secp256k1`.

```javascript
const elliptic = require('elliptic');
```

#### Classe `KeyGenerator`

La classe `KeyGenerator` est utilisée pour générer des paires de clés privées et publiques.

```javascript
class KeyGenerator {
    generate() {
        const EC = new (elliptic.ec)('secp256k1');
        const key = EC.genKeyPair();
        return {
            privateKey: key.getPrivate('hex'),
            publicKey: key.getPublic('hex'),
        };
    }
}
```

- `generate` : Cette méthode crée une nouvelle paire de clés en utilisant la courbe elliptique `secp256k1` et retourne un objet contenant la clé privée et la clé publique en format hexadécimal.

#### Classe `SignatureGenerator`

La classe `SignatureGenerator` est utilisée pour signer des messages et vérifier des signatures.

```javascript
class SignatureGenerator {
    constructor() {
        this.key = undefined;
    }

    fromPrivate(privateKey) {
        this.key = (new (elliptic.ec)('secp256k1')).keyFromPrivate(privateKey, 'hex');
        return this;
    }

    fromPublic(publicKey) {
        this.key = (new (elliptic.ec)('secp256k1')).keyFromPublic(publicKey, 'hex');
        return this;
    }

    getAddress() {
        return (this.key) ? this.key.getPublic('hex') : undefined;
    }

    generate(hash) {
        const signature = this.key.sign(hash, 'base64');
        return signature.toDER('hex');
    }

    verify(hash, signature) {
        return this.key.verify(hash, signature);
    }
}
```

- `constructor` : Initialise la propriété `key` à `undefined`.
- `fromPrivate(privateKey)` : Initialise `this.key` avec une clé privée en utilisant `secp256k1` et retourne l'instance de `SignatureGenerator`.
- `fromPublic(publicKey)` : Initialise `this.key` avec une clé publique en utilisant `secp256k1` et retourne l'instance de `SignatureGenerator`.
- `getAddress` : Retourne l'adresse publique de la clé si elle est définie, sinon retourne `undefined`.
- `generate(hash)` : Signe un hash en utilisant la clé privée et retourne la signature en format DER hexadécimal.
- `verify(hash, signature)` : Vérifie une signature donnée contre un hash en utilisant la clé publique.

#### Exportation des Classes

Enfin, les classes `KeyGenerator` et `SignatureGenerator` sont exportées pour être utilisées ailleurs dans le projet.

```javascript
exports.KeyGenerator = KeyGenerator;
exports.SignatureGenerator = SignatureGenerator;
```

### Résumé

Ce code implémente deux classes pour la gestion des clés et des signatures dans une blockchain. `KeyGenerator` génère des paires de clés privées et publiques, tandis que `SignatureGenerator` utilise ces clés pour signer des messages et vérifier des signatures. Les opérations cryptographiques sont basées sur la courbe elliptique `secp256k1`, couramment utilisée dans les applications de blockchain pour assurer la sécurité et l'intégrité des transactions.


## Utilisation du code dans l'application
## App.js

Ce document explique le code JavaScript utilisé pour créer et gérer une blockchain, des transactions, et des portefeuilles.

#### Importation des Modules
Le code commence par importer les modules nécessaires :
- `Blockchain` pour gérer la blockchain.
- `Transaction` pour gérer les transactions.
- `KeyGenerator` pour générer les clés publiques et privées.

```javascript
const Blockchain = require('./Data/blockchain');
const Transaction = require('./Data/transaction');
const { KeyGenerator } = require('./Data/signature');
```

#### Création de la Blockchain Exemple

Une instance de `Blockchain` est créée et exportée sous le nom `exchain`.

```javascript
export const exchain = new Blockchain();
```

#### Création de l'Adresse d'un Mineur

Une clé publique pour le mineur est générée et exportée sous le nom `minorAddress`.

```javascript
export const minorAddress = new KeyGenerator().generate().publicKey;
```

#### Création du Wallet Exemple et de la Liste des Wallets

Une liste de portefeuilles est créée, et une fonction `newWallet` est définie pour ajouter de nouveaux portefeuilles à cette liste.

```javascript
export const wallets = [];
export const newWallet = (name, balance = 0) => {
  let wallet = (new KeyGenerator()).generate();
  new Transaction(exchain.system.publicKey, wallet.publicKey, 1000).sign(exchain.system.privateKey);
  exchain.mine(minorAddress);
  wallets.push({
    name: name,
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
    balance: exchain.getBalance(wallet.publicKey)
  });
};
```

- `wallets` : Un tableau pour stocker les portefeuilles.
- `newWallet` : Une fonction qui crée un nouveau portefeuille, effectue une transaction initiale depuis le système pour créditer le portefeuille avec un solde initial de 1000 unités, mine un nouveau bloc pour inclure cette transaction, puis ajoute le portefeuille à la liste `wallets`.

##### Exemple de Création de Portefeuille

Un portefeuille nommé "Mon Wallet" est créé en utilisant la fonction `newWallet`.

```javascript
newWallet('Mon Wallet');
```

#### Création d'une Transaction Système

Une transaction est créée et signée par le système pour transférer 1000 unités au portefeuille nouvellement créé. Le solde du portefeuille est mis à jour, et la transaction est ajoutée à la blockchain.

```javascript
const systemTransaction = (new Transaction(exchain.system.publicKey, wallets[0].publicKey, 1000)).sign(exchain.system.privateKey);
wallets[0].balance = exchain.getBalance(wallets[0].publicKey);
exchain.addTransaction(systemTransaction);
```

### Résumé

Ce code met en place une blockchain avec une capacité de transaction et de gestion des portefeuilles. Il crée une instance de la blockchain, génère une clé publique pour un mineur, et définit une fonction pour créer des portefeuilles avec des soldes initiaux. Une transaction de démonstration est effectuée pour illustrer le transfert de fonds à un nouveau portefeuille. La blockchain permet de miner des blocs pour inclure les transactions, garantissant l'intégrité et la sécurité des échanges.

### Transaction.js 
### Explication du Code React

Ce document explique le code React d'un composant `Transactions` utilisé pour créer et soumettre des transactions sur une blockchain.

#### Importation des Modules
Le code commence par importer les modules nécessaires :
- `React` pour créer le composant.
- `Autocomplete`, `AutocompleteItem`, `Input` de `@nextui-org/react` pour les composants d'interface utilisateur.
- `exchain`, `wallets` depuis le fichier principal de l'application.
- `Transaction` pour créer des transactions.

```javascript
import React from 'react';
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { exchain, wallets } from '../App';
const Transaction = require('../Data/transaction.js');
```

#### Définition du Composant `Transactions`

Le composant `Transactions` permet aux utilisateurs de créer et soumettre de nouvelles transactions sur la blockchain.

```javascript
export default function Transactions() {
  const createTransaction = (e) => {
    e.preventDefault();
    let sendAddress = wallets[0].publicKey;
    let destinationAddress = e.target.destinationAddress.value.substring(
      e.target.destinationAddress.value.indexOf("[") + 1,
      e.target.destinationAddress.value.indexOf("]")
    );
    let amount = e.target.amount.value;
    exchain.addTransaction(new Transaction(sendAddress, destinationAddress, amount));
    console.log(exchain.pendingTransactions);
  };

  return (
    <form className='flex flex-col justify-between min-h-60' onSubmit={createTransaction}>
      <Autocomplete
        isDisabled
        placeholder={wallets[0].name + " [" + wallets[0].publicKey + "]"}
        label="Expéditeur"
        name='sendAddress'
      />
      <Autocomplete
        isRequired
        label="Destinataire"
        name='destinationAddress'
      >
        {wallets.slice(1).map((wallet) => (
          <AutocompleteItem key={wallet.publicKey} value={wallet.publicKey}>
            {wallet.name + " [" + wallet.publicKey + "]"}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Input type="number" name='amount' placeholder="Montant" defaultValue='10' isRequired />
      <Input type='submit' value='Créer la transaction' className='rounded-md p-2' />
    </form>
  );
}
```

#### Détails du Code

1. **Gestion de la Soumission du Formulaire**
    - La fonction `createTransaction` est appelée lorsque le formulaire est soumis.
    - Elle empêche le comportement par défaut du formulaire avec `e.preventDefault()`.
    - Elle extrait l'adresse de l'expéditeur (`sendAddress`), l'adresse du destinataire (`destinationAddress`), et le montant de la transaction (`amount`) à partir des valeurs du formulaire.
    - Une nouvelle transaction est créée et ajoutée à la blockchain.
    - Les transactions en attente (`pendingTransactions`) sont affichées dans la console pour vérification.

```javascript
const createTransaction = (e) => {
  e.preventDefault();
  let sendAddress = wallets[0].publicKey;
  let destinationAddress = e.target.destinationAddress.value.substring(
    e.target.destinationAddress.value.indexOf("[") + 1,
    e.target.destinationAddress.value.indexOf("]")
  );
  let amount = e.target.amount.value;
  exchain.addTransaction(new Transaction(sendAddress, destinationAddress, amount));
  console.log(exchain.pendingTransactions);
};
```

2. **Formulaire de Création de Transaction**
    - Le formulaire contient trois champs :
        - Un champ `Autocomplete` pour l'adresse de l'expéditeur (désactivé, affichant seulement le nom et la clé publique du premier portefeuille).
        - Un champ `Autocomplete` pour l'adresse du destinataire (requis, avec une liste d'adresses disponibles parmi les autres portefeuilles).
        - Un champ `Input` pour le montant de la transaction (requis, avec une valeur par défaut de 10).
    - Un bouton de soumission pour créer la transaction.

```javascript
return (
  <form className='flex flex-col justify-between min-h-60' onSubmit={createTransaction}>
    <Autocomplete
      isDisabled
      placeholder={wallets[0].name + " [" + wallets[0].publicKey + "]"}
      label="Expéditeur"
      name='sendAddress'
    />
    <Autocomplete
      isRequired
      label="Destinataire"
      name='destinationAddress'
    >
      {wallets.slice(1).map((wallet) => (
        <AutocompleteItem key={wallet.publicKey} value={wallet.publicKey}>
          {wallet.name + " [" + wallet.publicKey + "]"}
        </AutocompleteItem>
      ))}
    </Autocomplete>
    <Input type="number" name='amount' placeholder="Montant" defaultValue='10' isRequired />
    <Input type='submit' value='Créer la transaction' className='rounded-md p-2' />
  </form>
);
```

### Résumé

Ce composant React permet aux utilisateurs de créer et soumettre des transactions sur une blockchain. Il utilise des composants d'interface utilisateur pour les champs de saisie et d'auto-complétion, extrait les informations du formulaire soumis, crée une nouvelle transaction, et l'ajoute à la blockchain. Les transactions en attente sont affichées dans la console pour vérification.