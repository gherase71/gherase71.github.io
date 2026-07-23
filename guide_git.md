# Guide Git

---

## Table des matières

1. [Qu'est-ce que Git ?](#1-quest-ce-que-git)
2. [Créer et configurer un dépôt](#2-créer-et-configurer-un-dépôt)
   - [Créer le dépôt distant](#21-créer-le-dépôt-distant)
   - [Cloner le dépôt sur votre ordinateur](#22-cloner-le-dépôt-sur-votre-ordinateur)
   - [Configurer votre identité locale](#23-configurer-votre-identité-locale)
   - [Ajouter des membres au dépôt](#24-ajouter-des-membres-au-dépôt)
3. [Travailler avec Git au quotidien](#3-travailler-avec-git-au-quotidien)
   - [Suivre l'état de son dépôt local : git status](#31-suivre-létat-de-son-dépôt-local--git-status)
   - [Comprendre les branches](#32-comprendre-les-branches)
   - [Partager son travail : add → commit → push](#33-partager-son-travail--add--commit--push)
   - [Mettre à jour le dépôt local](#34-mettre-à-jour-le-dépôt-local)
   - [Consulter l'historique et revenir en arrière](#35-consulter-lhistorique-et-revenir-en-arrière)
   - [Gérer les conflits](#36-gérer-les-conflits)
   - [Exclure des fichiers avec .gitignore](#37-exclure-des-fichiers-avec-gitignore)
4. [Résumé des commandes essentielles](#4-résumé-des-commandes-essentielles)

---

## 1. Qu'est-ce que Git

Git est un logiciel de **gestion de versions décentralisé**. Il permet de suivre l'historique des modifications d'un projet et de coordonner le travail de plusieurs personnes sur un même projet.

**Principe de fonctionnement :**

- Un **répertoire distant** (appelé *remote*) est hébergé sur une plateforme en ligne, comme le GitLab de l'Inria ou GitHub.
- Chaque collaborateur crée une **copie locale** de ce répertoire sur son ordinateur pour y travailler.
- Les modifications locales **peuvent** ensuite être partagées vers le répertoire distant, et inversement.

**Principaux avantages :**

- **Collaboration en parallèle** : plusieurs personnes peuvent travailler simultanément sur les mêmes fichiers.
- **Sauvegarde distante** : votre travail est protégé sur le serveur même si votre machine tombe en panne.
- **Historique complet** : chaque modification est enregistrée et il est possible de revenir à n'importe quel état antérieur.
- **Partage et visibilité** : un dépôt public est accessible à toute la communauté.

L'ensembles des commandes et des informations est donné pour un système linux et pour le gitlab de l'Inria cependant tout est faisable de façon très similaire sur GitHub et/ou avec un système Windows.

---

## 2. Créer et configurer un dépôt

### 2.1. Créer le dépôt distant

Rendez-vous sur le gitlab de l'Inria et connectez-vous avec vos identifiants Inria.

- Dans le menu principal, cliquez sur **New project**.
- Choisissez un nom de projet et définissez sa visibilité : **Privé** (accès sur invitation) ou **Public** (accessible à tous).
- Confirmez la création. Votre dépôt distant est prêt.

---

### 2.2. Cloner le dépôt sur votre ordinateur

Cloner signifie créer une copie locale du dépôt distant. Deux méthodes existent. **La méthode SSH est recommandée** car elle ne demande plus de saisir ses identifiants à chaque opération.

#### Méthode SSH (recommandée)

**Étape 1 — Générer une clé SSH** (à faire une seule fois par ordinateur) :

```bash
ssh-keygen -t ed25519 -C "votre.email@inria.fr"
```
Vous devez nommer votre clé id_ed25519 afin qu'elle soit trouvée automatiquement.

Cette commande crée deux fichiers dans le dossier `~/.ssh/` : une clé privée et une clé publique (fichier `.pub`). Ne partagez jamais la clé privée. 

**Étape 2 — Ajouter la clé publique à votre profil GitLab :**

- Copiez le contenu du fichier `~/.ssh/id_ed25519.pub` :
  ```bash
  cat ~/.ssh/id_ed25519.pub
  ```
- Sur GitLab, allez dans **Préférences de votre profil → SSH Keys**.
- Cliquez sur **Add new key**, collez la clé publique, puis validez.

> **Note :** cette configuration est valable pour tous vos futurs dépôts GitLab depuis ce même ordinateur. Si vous travaillez depuis un autre PC, il faudra générer et enregistrer une nouvelle clé.

**Étape 3 — Cloner le dépôt :**

- Sur la page de votre dépôt GitLab, cliquez sur le bouton **Code**.
- Copiez l'URL sous *Clone with SSH* (format : `git@gitlab.inria.fr:utilisateur/projet.git`).
- Dans un terminal, placez-vous dans le dossier de destination, puis exécutez :

```bash
git clone git@gitlab.inria.fr:utilisateur/projet.git
```

#### Méthode HTTPS (alternative)

Si vous ne souhaitez pas configurer de clé SSH, vous pouvez utiliser HTTPS. GitLab vous demandera votre nom d'utilisateur et un token d'accès à chaque opération.

- Sur la page du dépôt, cliquez sur **Code** et copiez l'URL HTTPS.

```bash
git clone https://gitlab.inria.fr/utilisateur/projet.git
```

---

### 2.3. Configurer votre identité locale

Avant votre premier commit, indiquez à Git votre nom et votre adresse e-mail. Ces informations apparaîtront dans l'historique.

```bash
git config --global user.name "Prénom Nom"
git config --global user.email "votre.email@inria.fr"
```

---

### 2.4. Ajouter des membres au dépôt

- Allez dans les **Paramètres du dépôt → Members**.
- Recherchez la personne par son nom ou son adresse e-mail GitLab.
- Choisissez son rôle :
  - **Reporter** — lecture seule
  - **Developer** — peut pousser du code
  - **Maintainer** — accès complet
- Validez l'invitation.

---

## 3. Travailler avec Git au quotidien

### 3.1. Suivre l'état de son dépôt local : git status

`git status` est la commande à utiliser afin d'afficher l'état de votre dépôt local : quels fichiers ont été modifiés, lesquels sont prêts à être commités, et si votre branche est à jour avec le dépôt distant.

```bash
git status
```

La réponse indique trois catégories de fichiers :

- **Changes to be committed** — fichiers ajoutés avec `git add`, prêts pour le prochain commit.
- **Changes not staged for commit** — fichiers modifiés mais pas encore ajoutés avec `git add`.
- **Untracked files** — nouveaux fichiers que Git ne suit pas encore.

> **Conseil :** lancez `git status` avant chaque `git add` et avant chaque `git push` pour ne pas commiter par erreur des fichiers non souhaités.

---

### 3.2. Comprendre les branches

Git organise le travail en **branches**.

- La branche principale s'appelle **`main`**. Elle représente généralement la version stable du projet.
- Lorsque vous développez une nouvelle fonctionnalité ou corrigez un problème, créez une **branche dédiée** pour ne pas perturber `main`.
- Une fois le travail terminé et validé, la branche peut être **fusionnée** dans `main`.

| Commande                     | Description                                                                |
|------------------------------|----------------------------------------------------------------------------|
| `git branch`                 | Afficher toutes les branches locales (la branche courante est marquée `*`) |
| `git branch ma_branche`      | Créer une nouvelle branche                                                 |
| `git checkout ma_branche`    | Basculer sur une branche existante                                         |
| `git checkout -b ma_branche` | Créer et basculer en une seule commande                                    |
| `git merge ma_branche`       | Fusionner une branche dans la branche courante                             |

---

### 3.3. Partager son travail : add → commit → push

Le cycle de base pour publier des modifications sur le dépôt distant se déroule en **trois étapes**.

> **répertoire de travail** → `git add` → **staging area** → `git commit` → **répertoire local** → `git push` → **répertoire distant**

**Étape 1 — Sélectionner les fichiers à inclure (`git add`) :**

```bash
git add nom_du_fichier.extension   # Ajouter un fichier spécifique
git add .                          # Ajouter tous les fichiers modifiés
```

**Étape 2 — Créer un commit (une sauvegarde locale) :**

```bash
git commit -m "Description claire de la modification"
```

> **Conseil :** rédigez des messages de commit explicites

**Étape 3 — Envoyer les commits sur le dépôt distant (`git push`) :**

```bash
git push -u origin nom_de_la_branche
```

> L'option `-u` n'est nécessaire qu'au premier push d'une branche. Les fois suivantes, `git push` suffit.

---

### 3.4. Mettre à jour le dépôt local

Lorsqu'un collaborateur a publié des modifications sur le dépôt distant, récupérez-les avec :

```bash
git pull
```

> **Attention :** pensez à faire un `git pull` avant de commencer à travailler chaque jour. Cela évite les conflits et garantit que vous travaillez sur la version la plus récente.

---

### 3.5. Consulter l'historique et revenir en arrière

| Commande                               | Description                                           |
|----------------------------------------|-------------------------------------------------------|
| `git log`                              | Afficher l'historique complet des commits             |
| `git log --oneline`                    | Historique condensé (une ligne par commit)            |
| `git log --oneline --graph`            | Historique sous forme d'arbre de branches             |
| `git show <identifiant_du_commit>`     | Détail d'un commit précis                             |
| `git checkout <identifiant_du_commit>` | Consulter l'état du projet à ce commit (mode lecture) |
| `git revert <identifiant_du_commit>`   | Annuler un commit en créant un nouveau commit inverse |

L'identifiant d'un commit est le code alphanumérique visible dans `git log`. Les 7 premiers caractères suffisent.

---

### 3.6. Gérer les conflits

Un conflit survient quand deux personnes ont modifié **le même endroit du même fichier** et que Git ne peut pas décider automatiquement quelle version conserver.

#### Éviter les conflits

- **Faites un `git pull` chaque matin** avant de commencer à travailler.
- **Travaillez sur des branches séparées** : si chaque personne a sa propre branche, les conflits n'apparaissent qu'au moment de la fusion, pas en cours de travail.
- **Commitez et pushez régulièrement** : des commits fréquents limitent la divergence entre les versions.
- **Communiquez** : si deux personnes doivent toucher au même fichier en même temps, coordonnez-vous.

#### Reconnaître un conflit

Git vous signale le problème au moment d'un `git pull` ou d'un `git merge` :

```
CONFLICT (content): Merge conflict in nom_du_fichier.extension
Automatic merge failed; fix conflicts and then commit the result.
```

`git status` liste alors les fichiers en conflit sous **"both modified"**.

#### Résoudre un conflit

Ouvrez le fichier en conflit dans votre éditeur. Git y a inséré des marqueurs visuels :

```
<<<<<<< HEAD
résultat = valeur_A * 2
=======
résultat = valeur_A + offset
>>>>>>> nom-de-la-branche
```

- La zone entre `<<<<<<< HEAD` et `=======` est **votre version**.
- La zone entre `=======` et `>>>>>>>` est **la version de l'autre branche**.

**Pour résoudre :**

1. Choisissez quelle version garder (ou combinez les deux manuellement).
2. Supprimez tous les marqueurs `<<<<<<<`, `=======`, `>>>>>>>`.
3. Sauvegardez le fichier.
4. Indiquez à Git que le conflit est résolu :
   ```bash
   git add nom_du_fichier.extension
   ```
5. Finalisez la résolution avec un commit :
   ```bash
   git commit -m "Résolution du conflit sur nom_du_fichier.extension"
   ```

> **Astuce :** la plupart des éditeurs de code (VS Code, PyCharm…) proposent une interface graphique pour résoudre les conflits, avec un bouton *Accept Current*, *Accept Incoming* ou *Accept Both*. C'est souvent plus confortable que d'éditer les marqueurs à la main.

---

### 3.7. Exclure des fichiers avec .gitignore

Certains fichiers ne doivent pas être versionnés : données volumineuses, fichiers de configuration locaux, résultats de calcul, fichiers temporaires générés automatiquement. Le fichier **`.gitignore`** indique à Git de les ignorer complètement.

#### Créer un .gitignore

À la racine de votre dépôt, créez un fichier nommé `.gitignore` et listez-y les fichiers ou dossiers à exclure, un par ligne :

```
.fichier_1
.fichier_2
...
dossier_1/
dossier_2/
...
```

Les lignes commençant par `#` sont des commentaires. Le caractère `*` est un joker (ex. : `*.csv` ignore tous les fichiers CSV).

#### Ajouter le .gitignore au dépôt

Le fichier `.gitignore` lui-même doit être versionné pour que toute l'équipe bénéficie des mêmes exclusions :

```bash
git add .gitignore
git commit -m "Ajout du .gitignore"
git push
```

> **Note :** si un fichier était déjà suivi par Git avant d'être ajouté au `.gitignore`, Git continuera à le suivre. Pour l'exclure rétroactivement : `git rm --cached nom_du_fichier`, puis committez.

> **Astuce :** le site [gitignore.io](https://www.toptal.com/developers/gitignore) génère automatiquement un `.gitignore` adapté à votre langage ou environnement (Python, R, Jupyter, etc.).

---

## 4. Résumé des commandes essentielles

| Commande                    | Description                                           |
|-----------------------------|-------------------------------------------------------|
| `git clone <url>`           | Cloner un dépôt distant en local                      |
| `git status`                | Voir l'état des fichiers (modifiés, en attente, etc.) |
| `git add <fichier>`         | Préparer un fichier pour le prochain commit           |
| `git commit -m "msg"`       | Créer un commit avec un message descriptif            |
| `git push`                  | Envoyer les commits locaux vers le dépôt distant      |
| `git pull`                  | Récupérer les modifications du dépôt distant          |
| `git branch`                | Lister les branches                                   |
| `git checkout <branche>`    | Changer de branche                                    |
| `git checkout -b <branche>` | Créer et basculer sur une nouvelle branche            |
| `git merge <branche>`       | Fusionner une branche dans la branche courante        |
| `git log --oneline`         | Voir l'historique condensé des commits                |
| `git revert <identifiant>`  | Annuler un commit de façon sécurisée                  |

---

**Ressources utiles :**
- Documentation officielle Git : https://git-scm.com/doc
- GitLab Inria : https://gitlab.inria.fr
- Aide GitLab : https://docs.gitlab.com
- Générateur de .gitignore : https://www.toptal.com/developers/gitignore