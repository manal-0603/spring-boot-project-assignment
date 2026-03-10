# Projet de Fin de Module — Spring Boot

## Système de Gestion de Réservation d'Espaces de Coworking

**Master 2**
**Module : Spring Boot**
**Année universitaire 2025 – 2026**

---

Chers étudiants,

Dans le cadre du module **Spring Boot**, vous êtes amenés à réaliser ce projet de fin de module. Vous trouverez ci-dessous l'énoncé complet, le barème de notation ainsi qu'un **frontend React.js prêt à l'emploi** avec des données statiques. Votre mission consiste à développer le backend Spring Boot et à connecter vos API au frontend fourni. Une **démo en ligne** est disponible pour vous permettre de visualiser le résultat attendu. Lisez attentivement l'ensemble de ce document avant de commencer.

Bon courage et bon développement !

---

> **Démo en ligne :** [https://manal-0603.github.io/spring-boot-project-assignment/](https://manal-0603.github.io/spring-boot-project-assignment/)
>
> Comptes de test pour la démo :
> - **Admin** : `ahmed.benali@email.com` (n'importe quel mot de passe)
> - **Membre** : `fatima.zahra@email.com` (n'importe quel mot de passe)

---

## 1. Contexte et objectifs du projet

Le projet consiste à concevoir et développer le **backend** d'une application web de gestion de réservation d'espaces de coworking. Cette application permet à des utilisateurs de consulter, réserver et gérer des espaces de travail (salles de réunion, bureaux individuels, espaces ouverts) au sein d'un ou plusieurs sites de coworking.

**Le frontend React.js vous est fourni** avec des données statiques. Votre travail consiste à :

1. Créer le backend Spring Boot (API REST)
2. Connecter le frontend au backend en remplaçant les données statiques par les vrais appels API

### Objectifs pédagogiques

- Maîtriser l'architecture en couches : `Controller → Service → Repository`
- Concevoir un modèle de données relationnel avec Spring Data JPA et Hibernate
- Implémenter une API RESTful respectant les bonnes pratiques
- Sécuriser l'application avec Spring Security et JWT
- Tester le code avec JUnit 5, Mockito et les tests d'intégration Spring Boot
- Documenter l'API avec Swagger
- Appliquer les bonnes pratiques de gestion de version, de configuration et de déploiement

---

## 2. Description fonctionnelle

### 2.1 Acteurs du système

| Acteur | Description |
|---|---|
| **Visiteur** | Utilisateur non authentifié. Peut consulter les espaces disponibles et créer un compte. |
| **Membre** | Utilisateur authentifié. Peut réserver des espaces, consulter et annuler ses réservations, laisser des avis. |
| **Administrateur** | Gère les espaces, les sites, les utilisateurs. Accède aux statistiques et au tableau de bord. |

### 2.2 Fonctionnalités détaillées

#### Module Authentification et Gestion des utilisateurs

- Inscription avec validation de l'adresse email (envoi d'un lien de confirmation)
- Connexion / Déconnexion avec génération de token JWT (Access Token + Refresh Token)
- Gestion du profil utilisateur (modification des informations personnelles, changement de mot de passe)
- Attribution et gestion des rôles (`ROLE_VISITOR`, `ROLE_MEMBER`, `ROLE_ADMIN`)
- Réinitialisation du mot de passe par email

#### Module Gestion des espaces

- CRUD complet sur les espaces (salles de réunion, bureaux individuels, open spaces)
- Chaque espace possède : un nom, un type, une capacité, une description, un prix horaire, une liste d'équipements (projecteur, tableau blanc, WiFi, etc.), et des photos
- Gestion des sites / localisations (un site peut contenir plusieurs espaces)
- Recherche et filtrage avancés : par type, capacité, prix, équipements, disponibilité, localisation
- Pagination et tri des résultats

#### Module Réservation

- Création d'une réservation en sélectionnant un espace, une date et un créneau horaire
- Vérification automatique de la disponibilité (pas de double réservation sur le même créneau)
- Gestion des statuts : `EN_ATTENTE`, `CONFIRMEE`, `ANNULEE`, `TERMINEE`
- Annulation avec règles métier (ex : annulation gratuite jusqu'à 24h avant)
- Historique des réservations pour chaque utilisateur
- Notifications par email : confirmation de réservation, rappel (veille), annulation

#### Module Administration et Tableau de bord

- Statistiques : taux d'occupation par espace, revenus par période, nombre de réservations
- Gestion des utilisateurs (activation, désactivation, changement de rôle)
- Export des données en CSV / Excel (bonus)

#### Module Avis et Notations (Bonus)

- Un membre peut laisser un avis (note sur 5 + commentaire) après une réservation terminée
- Affichage de la note moyenne par espace
- Modération des avis par l'administrateur

---

## 3. Spécifications techniques

### 3.1 Stack technologique imposée

| Composant | Technologie |
|---|---|
| Framework | Spring Boot 3.x (Java 17+) |
| Persistance | Spring Data JPA + Hibernate |
| Base de données | PostgreSQL ou MySQL |
| Sécurité | Spring Security + JWT |
| Validation | Jakarta Bean Validation (Hibernate Validator) |
| Documentation API | Swagger |
| Email | Spring Mail (JavaMailSender) |
| Tests | JUnit 5, Mockito, Spring Boot Test, Testcontainers (bonus) |
| Build | Maven ou Gradle |
| Versioning | Git (GitHub) |

### 3.2 Architecture attendue

Le projet doit respecter une architecture en couches clairement séparée :

| Couche | Rôle |
|---|---|
| **Controller** | Réception des requêtes HTTP, validation des entrées, appel aux services. Utilisation de `@RestController`. |
| **Service** | Logique métier. Utilisation de `@Service`. Gestion des transactions avec `@Transactional`. |
| **Repository** | Accès aux données. Utilisation de `JpaRepository` avec des requêtes personnalisées si nécessaire. |
| **DTO / Mapper** | Objets de transfert de données. Utilisation de MapStruct ou conversion manuelle. Jamais exposer les entités directement. |
| **Exception** | Gestion centralisée des exceptions avec `@ControllerAdvice` et `@ExceptionHandler`. |
| **Config** | Configuration de la sécurité, CORS, Swagger, profils Spring (dev, prod). |

### 3.3 Modèle de données (entités principales)

Voici les entités minimales attendues. Vous êtes libres d'enrichir le modèle selon vos besoins.

| Entité | Attributs clés | Relations |
|---|---|---|
| **User** | id, nom, prénom, email, mot de passe (haché), rôle, actif, date d'inscription | `1..*` Reservation, `1..*` Review |
| **Space** | id, nom, type (ENUM), capacité, description, prix/heure, équipements, photos | `N..1` Site, `1..*` Reservation, `1..*` Review |
| **Site** | id, nom, adresse, ville, code postal, telephone | `1..*` Space |
| **Reservation** | id, date, heure debut, heure fin, statut (ENUM), montant total, date creation | `N..1` User, `N..1` Space |
| **Review** | id, note (1-5), commentaire, date | `N..1` User, `N..1` Space |

### 3.4 Contraintes techniques obligatoires

- Utiliser des **DTO** pour toutes les entrées/sorties de l'API (ne jamais exposer les entités JPA directement)
- Valider toutes les entrées utilisateur avec `@Valid`, `@NotBlank`, `@Email`, `@Size`, `@Min`, `@Max`, etc.
- Gérer les erreurs de manière centralisée avec un format de réponse d'erreur uniforme (`timestamp`, `status`, `message`, `path`)
- Protéger les endpoints selon les rôles (ex : seul un ADMIN peut créer un espace)
- Paginer les résultats de recherche (`Pageable` de Spring Data)
- Utiliser des profils Spring (`application-dev.yml`, `application-prod.yml`)
- Loguer les actions importantes avec SLF4J / Logback

---

## 4. Endpoints API attendus

### Authentification

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Inscription d'un nouvel utilisateur |
| POST | `/api/auth/login` | Connexion et obtention du JWT |
| POST | `/api/auth/refresh` | Rafraîchir le token d'accès |
| POST | `/api/auth/forgot-password` | Demande de réinitialisation du mot de passe |

### Espaces

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/spaces` | Liste des espaces (avec filtres et pagination) |
| GET | `/api/spaces/{id}` | Détail d'un espace |
| POST | `/api/spaces` | Créer un espace (ADMIN) |
| PUT | `/api/spaces/{id}` | Modifier un espace (ADMIN) |
| DELETE | `/api/spaces/{id}` | Supprimer un espace (ADMIN) |
| GET | `/api/spaces/{id}/availability` | Vérifier la disponibilité d'un espace |

### Réservations

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/reservations` | Créer une réservation (MEMBER) |
| GET | `/api/reservations/me` | Mes réservations (MEMBER) |
| PUT | `/api/reservations/{id}/cancel` | Annuler une réservation |
| GET | `/api/admin/reservations` | Toutes les réservations (ADMIN) |

### Administration

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | Liste des utilisateurs |
| PUT | `/api/admin/users/{id}/role` | Changer le rôle d'un utilisateur |
| GET | `/api/admin/stats/dashboard` | Statistiques générales |

---

## 5. Barème de notation

| Critère | Points | Détail |
|---|---|---|
| Modèle de données et JPA | /3 | Entités, relations, migrations |
| API REST et Controllers | /3 | Endpoints, DTO, validation, pagination |
| Logique métier (Services) | /3 | Règles métier, gestion des conflits |
| Sécurité (Spring Security + JWT) | /3 | Authentification, autorisation, rôles |
| Tests | /2 | Unitaires et intégration |
| Documentation (Swagger + README) | /1 | Clarté, complétude |
| Qualité du code et architecture | /2 | Structure, lisibilité, bonnes pratiques |
| Git et gestion de version | /1 | Historique de commits propre et régulier |
| Intégration des APIs dans le frontend React | /2 | Remplacement des données statiques par les vrais appels API, connexion JWT |
| **TOTAL** | **/20** | |

> **Bonus (+2 points max)** : Module avis/notations complet, Dockerisation de l'application, CI/CD avec GitHub Actions, cache Redis.

---

## 6. Livrables attendus

- Code source complet sur un dépôt Git accessible (GitHub / GitLab) avec un historique de commits propre et régulier
- Fichier `README.md` détaillé comprenant : description du projet, pre-requis, instructions d'installation et de lancement, identifiants de test, captures d'écran de Swagger UI
- Documentation Swagger générée et accessible via `/swagger-ui.html`
- Collection Postman ou fichier `.http` avec tous les scénarios de test fonctionnels
- Script SQL ou fichier `data.sql` pour le jeu de données de démonstration
- Rapport technique (5-10 pages) : choix d'architecture, diagrammes UML (classes, sequence), difficultés rencontrées et solutions apportées

---

## 7. Critères de qualité du code

Votre code sera évalué sur les critères suivants :

- Respect des conventions de nommage Java (`camelCase`, `PascalCase` pour les classes)
- Séparation claire des responsabilités entre les couches
- Absence de code mort, de commentaires inutiles ou de `System.out.println`
- Utilisation correcte des annotations Spring (`@Autowired` évité au profit de l'injection par constructeur)
- Gestion correcte des transactions et des exceptions
- Configuration externalisée (pas de valeurs en dur dans le code)
- Utilisation de Lombok pour reduire le boilerplate (optionnel mais recommandé)

---

## 8. Le frontend fourni (ce projet)

Ce projet React.js vous est fourni avec une **interface complète** et des **données statiques**. Votre mission est de créer le backend et de connecter les API.

### 8.1 Démo en ligne

Consultez la démo pour comprendre toutes les fonctionnalités attendues :

**[https://manal-0603.github.io/spring-boot-project-assignment/](https://manal-0603.github.io/spring-boot-project-assignment/)**

### 8.2 Installation et lancement en local

```bash
# 1. Cloner le projet
git clone https://github.com/manal-0603/spring-boot-project-assignment.git
cd coworking-frontend

# 2. Installer Node.js (v18+) depuis https://nodejs.org

# 3. Installer les dépendances
npm install

# 4. Lancer le serveur de developpement
npm run dev

# L'application sera accessible sur http://localhost:3000
```

### 8.3 Comptes de test (données statiques)

| Email | Rôle | Accès |
|---|---|---|
| `ahmed.benali@email.com` | ADMIN | Tableau de bord, gestion espaces/utilisateurs/réservations |
| `fatima.zahra@email.com` | MEMBER | Réservation, mes réservations, avis |
| `mohamed.alami@email.com` | MEMBER | Réservation, mes réservations, avis |

> Avec les données statiques, **n'importe quel mot de passe** fonctionne.

### 8.4 Structure du projet frontend

```
src/
├── api/                          # Services API (déjà configurés avec les bons endpoints)
│   ├── axiosConfig.js            # Configuration Axios + intercepteurs JWT
│   ├── authApi.js                # POST /api/auth/register, /login, /refresh, /forgot-password
│   ├── spaceApi.js               # GET/POST/PUT/DELETE /api/spaces
│   ├── reservationApi.js         # POST /api/reservations, GET /me, PUT /cancel
│   ├── adminApi.js               # GET /api/admin/users, /stats/dashboard
│   └── reviewApi.js              # GET/POST /api/spaces/{id}/reviews
│
├── data/
│   └── mockData.js               # Données statiques (à remplacer par l'API)
│
├── context/
│   └── AuthContext.jsx            # Contexte d'authentification (à connecter au JWT)
│
├── components/                   # Composants réutilisables
│   ├── layout/                   # Navbar, Footer, Layout
│   ├── spaces/                   # SpaceCard, SpaceFilter, SpaceList
│   ├── reservations/             # ReservationCard, ReservationForm
│   ├── reviews/                  # ReviewItem, ReviewForm
│   ├── admin/                    # StatCard, UserTable
│   └── common/                   # ProtectedRoute, Pagination
│
├── pages/                        # Pages de l'application
│   ├── Home.jsx                  # Page d'accueil
│   ├── Login.jsx                 # Connexion
│   ├── Register.jsx              # Inscription
│   ├── SpacesPage.jsx            # Liste des espaces avec filtres
│   ├── SpaceDetailPage.jsx       # Detail + reservation + avis
│   ├── MyReservationsPage.jsx    # Mes reservations
│   ├── ProfilePage.jsx           # Profil utilisateur
│   └── admin/
│       ├── DashboardPage.jsx     # Tableau de bord (stats)
│       ├── ManageSpacesPage.jsx  # CRUD espaces
│       ├── ManageUsersPage.jsx   # Gestion utilisateurs
│       └── AllReservationsPage.jsx # Toutes les reservations
│
├── App.jsx                       # Routes de l'application
├── main.jsx                      # Point d'entree
└── index.css                     # Styles (Tailwind CSS)
```

### 8.5 Comment connecter votre backend

#### Étape 1 : Configuration CORS dans Spring Boot

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

#### Étape 2 : Remplacer les données statiques par les appels API

**Exemple dans `AuthContext.jsx` :**

```jsx
// AVANT (donnees statiques) :
const foundUser = mockUsers.find((u) => u.email === email);

// APRES (API reelle) :
const response = await authApi.login({ email, password });
localStorage.setItem("accessToken", response.data.accessToken);
setUser(response.data.user);
```

**Exemple dans une page :**

```jsx
// AVANT :
import { mockSpaces } from "../data/mockData";
const [spaces, setSpaces] = useState(mockSpaces);

// APRES :
import { spaceApi } from "../api/spaceApi";

useEffect(() => {
  const fetchSpaces = async () => {
    const response = await spaceApi.getAll(filters);
    setSpaces(response.data.content); // Spring Data Page
  };
  fetchSpaces();
}, [filters]);
```

#### Étape 3 : Proxy de développement

Le fichier `vite.config.js` redirige automatiquement les appels `/api` vers `http://localhost:8080` (votre serveur Spring Boot). Il suffit de lancer les deux serveurs :

- **Backend Spring Boot** : port `8080`
- **Frontend React** : port `3000`

### 8.6 Technologies du frontend

| Technologie | Usage |
|---|---|
| React 18 + Vite | Framework frontend + build tool |
| React Router 6 | Navigation SPA |
| Axios | Appels HTTP vers l'API |
| Tailwind CSS | Framework CSS utilitaire |
| React Icons | Icônes (Feather Icons) |

---

**Bon courage et bon développement !**
