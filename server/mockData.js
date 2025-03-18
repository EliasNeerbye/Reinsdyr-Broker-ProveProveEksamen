require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const Beiteområde = require("./models/Beiteområde");
const Eier = require("./models/Eier");
const Flokk = require("./models/Flokk");
const Reinsdyr = require("./models/Reinsdyr");

const DB_URI =
    process.env.PROD_TRUE === "true"
        ? `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_IP}/reindeerBroker`
        : `mongodb://${process.env.MONGO_IP}/reindeerBroker`;

const reinsdyrNavn = [
    "Blitzen", "Dasher", "Dancer", "Prancer", "Vixen", "Comet", "Cupid", "Donner", "Rudolf", "Svenn", 
    "Olav", "Nils", "Kari", "Erik", "Freya", "Thor", "Loki", "Odin", "Frigg", "Balder", 
    "Idunn", "Heimdall", "Siv", "Frøy", "Frøya", "Njord", "Skade", "Tyr", "Ull", "Brage", 
    "Vale", "Vidar", "Åsa", "Magni", "Modi", "Rind", "Sigyn", "Forseti", "Eir", "Sjofn", 
    "Lofn", "Vor", "Syn", "Hlin", "Saga", "Hel", "Jord", "Nanna", "Gefjon", "Ran", 
    "Gerd", "Fulla", "Atle", "Snorre", "Harald", "Magnus", "Gro", "Ingrid", "Birger", "Sigrid", 
    "Nora", "Håkon", "Gunnar", "Astrid"
];

const flokkNavn = [
    "Nordlys", "Midnattsol", "Snøfnugg", "Isbre", "Fjelltopp", "Bjørkeskog", "Elvebris", 
    "Vidde", "Tundra", "Fjord", "Polarstjerne", "Taiga", "Aurora", "Permafrost", 
    "Reinrose", "Kantarell", "Måneskin"
];

const merkeNavn = [
    "Dobbel V", "Trekantet Snitt", "Høyre Spiss", "Venstre Bunn", "Midtdelt", "Kronekryss", 
    "Stjernesnitt", "Piltegn", "Ringmerke", "Dobbeltkryss", "Flaggmerke", "Bølgelinje", 
    "Spiralmerke", "Solsymbol", "Månefase", "Trippelpunkt", "Triangelhakk"
];

const eiere = [
    {
        navn: "Johan Nilsen",
        epost: "eier@1.com",
        passord: "passord1",
        telefon: "+47 912 34 567",
        kontaktspråk: "Nord",
    },
    {
        navn: "Marit Olsen",
        epost: "eier@2.com",
        passord: "passord2",
        telefon: "+47 876 54 321",
        kontaktspråk: "Sør",
    },
];

async function waitForKeypress(message) {
    const readline = require("readline");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(message || "Press any key to continue...", () => {
            rl.close();
            resolve();
        });
    });
}

async function initializeDatabase() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB successfully");

        const beiteCount = await Beiteområde.countDocuments();
        const eierCount = await Eier.countDocuments();
        const flokkCount = await Flokk.countDocuments();
        const reinsdyrCount = await Reinsdyr.countDocuments();

        console.log("Current database state:");
        console.log(`- Beiteområder: ${beiteCount}`);
        console.log(`- Eiere: ${eierCount}`);
        console.log(`- Flokker: ${flokkCount}`);
        console.log(`- Reinsdyr: ${reinsdyrCount}`);

        if (beiteCount > 0 || eierCount > 0 || flokkCount > 0 || reinsdyrCount > 0) {
            const shouldProceed = await confirmContinue("Database already contains data. This will add more data. Continue? (y/n): ");
            if (!shouldProceed) {
                console.log("Operation cancelled by user.");
                await mongoose.disconnect();
                return;
            }
        }

        console.log("\n===== CREATING BEITEOMRÅDER =====");
        const beiteområder = await createBeiteområder();
        console.log(`Created ${beiteområder.length} beiteområder`);

        console.log("\n===== CREATING EIERE (OWNERS) =====");
        const createdEiere = await createEiere();
        console.log(`Created ${createdEiere.length} eiere (owners)`);

        console.log("\n===== CREATING FLOKKER (HERDS) =====");
        const createdFlokker = await createFlokker(createdEiere, beiteområder);
        console.log(`Created ${createdFlokker.length} flokker (herds)`);

        console.log("\n===== CREATING REINSDYR (REINDEER) =====");
        const createdReinsdyr = await createReinsdyr(createdFlokker);
        console.log(`Created ${createdReinsdyr.length} reinsdyr (reindeer)`);

        console.log("\n===== DATABASE INITIALIZATION COMPLETE =====");
        console.log("Created:");
        console.log(`- ${beiteområder.length} beiteområder`);
        console.log(`- ${createdEiere.length} eiere (owners)`);
        console.log(`- ${createdFlokker.length} flokker (herds)`);
        console.log(`- ${createdReinsdyr.length} reinsdyr (reindeer)`);

        console.log("\n===== OWNER CREDENTIALS =====");
        createdEiere.forEach((eier, index) => {
            console.log(`Owner ${index + 1}:`);
            console.log(`- Name: ${eier.navn}`);
            console.log(`- Email: ${eier.epost}`);
            console.log(`- Password: ${eiere[index].passord} (plain text)`);
            console.log(`- Phone: ${eier.telefon}`);
            console.log(`- Language: ${eier.kontaktspråk}`);
            console.log("");
        });
    } catch (error) {
        console.error("Error initializing database:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

function confirmContinue(message) {
    const readline = require("readline");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(message || "Continue? (y/n): ", (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === "y");
        });
    });
}

async function createBeiteområder() {
    const BEITEOMRÅDE_FYLKER_MAPPING = {
        Sør: ["Trøndelag", "Nordland", "Jämtland", "Västernorrland"],
        Ume: ["Västerbotten"],
        Pite: ["Norrbotten"],
        Lule: ["Nordland", "Norrbotten"],
        Nord: ["Finnmark", "Troms", "Nordland", "Norrbotten", "Lappi"],
        Enare: ["Lappi"],
        Skolt: ["Lappi", "Murmansk oblast"],
        Akkala: ["Murmansk oblast"],
        Kildin: ["Murmansk oblast"],
        Ter: ["Murmansk oblast"],
    };

    const beiteområder = [];

    for (const area of Object.keys(BEITEOMRÅDE_FYLKER_MAPPING)) {
        try {
            const existing = await Beiteområde.findOne({ primærBeiteområde: area });

            if (existing) {
                console.log(`Beiteområde "${area}" already exists (ID: ${existing._id}). Using existing.`);
                beiteområder.push(existing);
                continue;
            }

            const newArea = new Beiteområde({
                primærBeiteområde: area,
                flokker: [],
            });

            await newArea.save();
            console.log(`Created new Beiteområde: ${area} (ID: ${newArea._id})`);
            beiteområder.push(newArea);
        } catch (error) {
            console.error(`Error creating Beiteområde "${area}":`, error.message);
        }
    }

    return beiteområder;
}

async function createEiere() {
    const createdEiere = [];
    const saltRounds = 10;

    for (const eierData of eiere) {
        try {
            const existing = await Eier.findOne({ epost: eierData.epost });

            if (existing) {
                console.log(`Eier (owner) with email "${eierData.epost}" already exists (ID: ${existing._id}). Using existing.`);
                createdEiere.push(existing);
                continue;
            }

            const hashedPassword = await bcrypt.hash(eierData.passord, saltRounds);
            const cleanedPhone = eierData.telefon.replace(/\D/g, "");

            const newEier = new Eier({
                navn: eierData.navn,
                epost: eierData.epost,
                passord: hashedPassword,
                telefon: cleanedPhone,
                kontaktspråk: eierData.kontaktspråk,
                flokker: [],
            });

            await newEier.save();
            console.log(`Created new Eier (owner): ${eierData.navn} (ID: ${newEier._id})`);
            createdEiere.push(newEier);
        } catch (error) {
            console.error(`Error creating Eier (owner) "${eierData.navn}":`, error.message);
        }
    }

    return createdEiere;
}

async function createFlokker(eiere, beiteområder) {
    const createdFlokker = [];
    const merkeBildeLenker = [
        `/assets/icons/favicon.ico`,
        `https://img.freepik.com/free-vector/cute-dino-dracula-vampire-cartoon-vector-icon-illustration-animal-holiday-icon-isolated-flat-vector_138676-11365.jpg?w=740`,
        `https://img.freepik.com/free-vector/cute-dinosaur-listening-music-with-headset-bring-backpack-cartoon-vector-icon-illustration-flat_138676-14296.jpg?w=740`,
        `https://img.freepik.com/free-vector/cute-cool-boy-dabbing-pose-cartoon-vector-icon-illustration-people-fashion-icon-concept-isolated_138676-5680.jpg?w=740`
    ];

    let currentEier = 0;

    for (const eier of eiere) {
        for (let i = 0; i < 2; i++) {
            try {
                const flokkNavnIndex = Math.floor(Math.random() * flokkNavn.length);
                const merkeNavnIndex = Math.floor(Math.random() * merkeNavn.length);
                const flokkSerienummer = `F-${uuidv4().substring(0, 8)}`;

                const navn = `${flokkNavn[flokkNavnIndex]} ${i + 1}`;
                const merke = `${merkeNavn[merkeNavnIndex]} ${i + 1}`;

                const beiteområde =
                    beiteområder.find((b) => b.primærBeiteområde === eier.kontaktspråk) || beiteområder[Math.floor(Math.random() * beiteområder.length)];

                const merkeBildelenke = merkeBildeLenker[i+currentEier];
                console.log(`Current i: ${i+currentEier}, Current BildeLenke${merkeBildelenke}`);

                const nyFlokk = new Flokk({
                    eierId: eier._id,
                    flokkNavn: navn,
                    flokkSerienummer: flokkSerienummer,
                    merkeNavn: merke,
                    merkeBildelenke: merkeBildelenke,
                    beiteområde: beiteområde._id,
                    reinsdyr: [],
                });

                await nyFlokk.save();

                eier.flokker.push(nyFlokk._id);
                await eier.save();

                beiteområde.flokker.push(nyFlokk._id);
                await beiteområde.save();

                console.log(`Created new Flokk (herd): ${navn} (ID: ${nyFlokk._id}) for eier ${eier.navn}`);
                createdFlokker.push(nyFlokk);
            } catch (error) {
                console.error(`Error creating Flokk (herd) for eier ${eier.navn}:`, error.message);
            }
        }
        currentEier = 2;
    }

    return createdFlokker;
}

async function createReinsdyr(flokker) {
    const createdReinsdyr = [];

    for (const flokk of flokker) {
        for (let i = 0; i < 20; i++) {
            try {
                const reinsdyrNavnIndex = Math.floor(Math.random() * reinsdyrNavn.length);
                const navn = `${reinsdyrNavn[reinsdyrNavnIndex]} ${i + 1}`;
                const serienummer = `R-${uuidv4().substring(0, 8)}`;

                const today = new Date();
                const tenYearsAgo = new Date();
                tenYearsAgo.setFullYear(today.getFullYear() - 10);

                const birthDate = new Date(tenYearsAgo.getTime() + Math.random() * (today.getTime() - tenYearsAgo.getTime()));

                const nyReinsdyr = new Reinsdyr({
                    serienummer: serienummer,
                    navn: navn,
                    flokkId: flokk._id,
                    fødselsdato: birthDate,
                });

                await nyReinsdyr.save();

                flokk.reinsdyr.push(nyReinsdyr._id);
                await flokk.save();

                if (i % 5 === 0) {
                    console.log(`Created reindeer ${i + 1}/20 for herd ${flokk.flokkNavn}`);
                }

                createdReinsdyr.push(nyReinsdyr);
            } catch (error) {
                console.error(`Error creating Reinsdyr (reindeer) for flokk ${flokk.flokkNavn}:`, error.message);
            }
        }
        console.log(`Finished creating 20 reindeer for herd ${flokk.flokkNavn}`);
    }

    return createdReinsdyr;
}

initializeDatabase()
    .then(() => console.log("Database initialization completed"))
    .catch((err) => console.error("Database initialization failed:", err));