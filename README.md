# Her er dokumentasjonen

## Tech Stack

| Teknologi | Kategori | Beskrivelse |
|-----------|----------|-------------|
| Node.js | Backend | JavaScript-runtime |
| Express.js | Backend | Webserver framework for håndtering av ruter og middleware |
| MongoDB | Database | NoSQL-database for lagring av data |
| Mongoose | Database | MongoDB ORM for Node.js, forenkler databaseoperasjoner |
| Express-session | Sikkerhet | Sesjonshåndtering for brukerautentisering |
| Connect-mongo | Sikkerhet | MongoDB sesjonslagring for Express-session |
| Bcrypt | Sikkerhet | Passordkrypteringsbibliotek for sikker brukerautentisering |
| EJS | Frontend | Template-engine for serverside-rendering |
| Dotenv | Verktøy | Håndtering av miljøvariabler |
| Helmet | Sikkerhet | Samling av sikkerhetsmiddleware for Express-applikasjoner |
| CORS | Sikkerhet | Cross-Origin Sikkerhetsmiddleware |
| PM2 | DevOps | Process-handler for Node.js-applikasjoner i produksjon |
| Nginx | DevOps | Webserver og omvendt proxy |
| UFW | DevOps | Brannmur for serversikkerhet |
| SSH | DevOps | Remote tilgang til server |

## ER Diagram:

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#BBDEFB',
    'primaryTextColor': '#000',
    'primaryBorderColor': '#2196F3',
    'lineColor': '#2196F3',
    'textColor': '#333'
  }
}}%%

erDiagram
    Eier {
        ObjectId _id
        String navn
        String epost "unique"
        String passord
        String telefon "unique"
        String kontaktspraak "Soer|Ume|Pite|Lule|Nord|Enare|Skolt|Akkala|Kildin|Ter"
        ObjectId[] flokker "Ref: Flokk"
    }
    
    Flokk {
        ObjectId _id
        ObjectId eierId "Ref: Eier, unique"
        String flokkNavn
        String flokkSerienummer "unique"
        String merkeNavn "unique"
        String merkeBildelenke "unique"
        ObjectId[] reinsdyr "Ref: Reinsdyr"
        ObjectId beiteomraade "Ref: Beiteomraade"
    }
    
    Reinsdyr {
        ObjectId _id
        String serienummer "unique"
        String navn
        ObjectId flokkId "Ref: Flokk"
        Date foedselsdato
    }

    Beiteomraade {
        ObjectId _id
        String primaerBeiteomraade "Soer|Ume|Pite|Lule|Nord|Enare|Skolt|Akkala|Kildin|Ter"
        String[] fylker "Nordland|Troms|Finnmark|Troendelag|Norrbotten|Vaesterbotten|Jaemtland|Vaesternorrland|Lappi|Murmansk oblast|Republikken Karelen"
        ObjectId[] flokker "Ref: Flokk"
    }

    Eier ||--o{ Flokk : "har"
    Flokk ||--o{ Reinsdyr : "inneholder"
    Flokk }o--|| Beiteomraade : "beiter i"
```

## Nettverkskart
```mermaid
flowchart LR
    %% Simple color scheme
    classDef client fill:#6610f2,stroke:#ffffff,stroke-width:2px,color:#ffffff
    classDef vm fill:#0d6efd,stroke:#ffffff,stroke-width:2px,color:#ffffff
    classDef firewall fill:#dc3545,stroke:#ffffff,stroke-width:1px,color:#ffffff
    classDef ssh fill:#212529,stroke:#ffffff,stroke-width:1px,color:#ffffff

    %% Main flow - bidirectional
    Internet([Internett/Brukere]) <--> UFW1{UFW Brannmur}
    UFW1 <--> NodeJS[NodeJS Server VM]
    NodeJS <--> UFW2{UFW Brannmur}
    UFW2 <--> MongoDB[(MongoDB Database VM)]
    
    %% SSH connections
    SSH([SSH-tilgang\nAdmin, Jens, Patrick, Geir, Monica]) -.-> UFW1
    SSH -.-> UFW2
    
    %% Apply classes
    class Internet client
    class NodeJS,MongoDB vm
    class UFW1,UFW2 firewall
    class SSH ssh

    %% Title
    subgraph title [Kukkik Ano - Nettverksarkitektur]
    end
    style title fill:none,stroke:none
```
