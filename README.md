# Her er dokumentasjonen

## Tech Stack

| Teknologi | Kategori | Beskrivelse |
|-----------|----------|-------------|
| Node.js | Backend | JavaScript-kjøretidsmiljø for serversideeksekvering |
| Express.js | Backend | Webapplikasjonsrammeverk for håndtering av ruter og middleware |
| MongoDB | Database | NoSQL-database for lagring av reinsdyr- og brukerdata |
| Mongoose | Database | MongoDB objektmodelleringsverktøy for Node.js, forenkler databaseoperasjoner |
| Express-session | Sikkerhet | Sesjonshåndtering for brukerautentisering |
| Connect-mongo | Sikkerhet | MongoDB sesjonslagring for Express-session |
| Bcrypt | Sikkerhet | Passordkrypteringsbibliotek for sikker brukerautentisering |
| EJS | Frontend | Mal-motor for serverside-rendering |
| Dotenv | Verktøy | Håndtering av miljøvariabler |
| PM2 | DevOps | Prosesshåndterer for Node.js-applikasjoner i produksjon |
| Nginx | DevOps | Webserver og omvendt proxy |
| UFW | DevOps | Ukomplisert brannmur for serversikkerhet |
| SSH | DevOps | Secure Shell for ekstern servertilgang |
| Helmet | Sikkerhet | Samling av sikkerhetsmiddleware for Express-applikasjoner |


## ER Diagram:

```mermaid
erDiagram
    Eier {
        ObjectId _id
        string navn
        string epost
        string passord
        enum kontaktSpraak "Sør|Ume|Pite|Lule|Nord|Enare|Skolt|Akkala|Kildin|Ter"
        string telefonnummer
        ObjectId[] flokker "Referanser til Flokk IDer"
    }
    
    Flokk {
        ObjectId _id
        ObjectId eierId
        string flokkNavn
        string flokkSerienummer
        string merkeNavn
        string merkeBildelenke
        ObjectId[] reinsdyr "Referanser til Reinsdyr IDer"
        ObjectId[] beiteomraader "Referanser til Beiteområde IDer"
    }
    
    Reinsdyr {
        ObjectId _id
        string serienummer
        string navn
        ObjectId flokkId
        date foodselsdato
    }

    Beiteomraade {
        ObjectId _id
        enum primeerBeiteomraade "Sør|Ume|Pite|Lule|Nord|Enare|Skolt|Akkala|Kildin|Ter"
        string[] fylker
        ObjectId[] flokker "Referanser til Flokk IDer"
    }

    Eier ||--o{ Flokk : eier
    Flokk }o--o{ Reinsdyr : "inneholder/tilhører"
    Flokk }o--o{ Beiteomraade : "beiter i/brukes av"
```