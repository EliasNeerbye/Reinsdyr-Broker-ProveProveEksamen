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
