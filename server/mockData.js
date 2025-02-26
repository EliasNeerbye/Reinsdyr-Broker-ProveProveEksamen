/**
 * Script to initialize complete test data:
 * 1. Create all Beiteområde documents
 * 2. Create two owners
 * 3. Create two herds for each owner
 * 4. Create 20 reindeer for each herd
 */
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// Import all required models
const Beiteområde = require("./models/Beiteområde");
const Eier = require("./models/Eier");
const Flokk = require("./models/Flokk");
const Reinsdyr = require("./models/Reinsdyr");

// Database connection parameters
const DB_URI =
    process.env.PROD_TRUE === "true"
        ? `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_IP}/reindeerBroker`
        : `mongodb://${process.env.MONGO_IP}/reindeerBroker`;

// Reindeer names
const reinsdyrNavn = [
    "Blitzen",
    "Dasher",
    "Dancer",
    "Prancer",
    "Vixen",
    "Comet",
    "Cupid",
    "Donner",
    "Rudolf",
    "Svenn",
    "Olav",
    "Nils",
    "Kari",
    "Erik",
    "Freya",
    "Thor",
    "Loki",
    "Odin",
    "Frigg",
    "Balder",
    "Idunn",
    "Heimdall",
    "Siv",
    "Frøy",
    "Frøya",
    "Njord",
    "Skade",
    "Tyr",
    "Ull",
    "Brage",
    "Vale",
    "Vidar",
    "Åsa",
    "Magni",
    "Modi",
    "Rind",
    "Sigyn",
    "Forseti",
    "Eir",
    "Sjofn",
    "Lofn",
    "Vor",
    "Syn",
    "Hlin",
    "Saga",
    "Hel",
    "Jord",
    "Nanna",
    "Gefjon",
    "Ran",
    "Gerd",
    "Fulla",
    "Atle",
    "Snorre",
    "Harald",
    "Magnus",
    "Gro",
    "Ingrid",
    "Birger",
    "Sigrid",
    "Nora",
    "Håkon",
    "Gunnar",
    "Astrid",
];

// Flokk names
const flokkNavn = [
    "Nordlys",
    "Midnattsol",
    "Snøfnugg",
    "Isbre",
    "Fjelltopp",
    "Bjørkeskog",
    "Elvebris",
    "Vidde",
    "Tundra",
    "Fjord",
    "Polarstjerne",
    "Taiga",
    "Aurora",
    "Permafrost",
    "Reinrose",
    "Kantarell",
    "Måneskin",
];

// Merke names
const merkeNavn = [
    "Dobbel V",
    "Trekantet Snitt",
    "Høyre Spiss",
    "Venstre Bunn",
    "Midtdelt",
    "Kronekryss",
    "Stjernesnitt",
    "Piltegn",
    "Ringmerke",
    "Dobbeltkryss",
    "Flaggmerke",
    "Bølgelinje",
    "Spiralmerke",
    "Solsymbol",
    "Månefase",
    "Trippelpunkt",
    "Triangelhakk",
];

// Owner data
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

// Wait for a keypress to continue
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
        // Connect to MongoDB
        console.log("Connecting to MongoDB...");
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB successfully");

        // Check if database already has content
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

        // STEP 1: Create Beiteområder
        console.log("\n===== CREATING BEITEOMRÅDER =====");
        const beiteområder = await createBeiteområder();
        console.log(`Created ${beiteområder.length} beiteområder`);

        // STEP 2: Create Eiere (Owners)
        console.log("\n===== CREATING EIERE (OWNERS) =====");
        const createdEiere = await createEiere();
        console.log(`Created ${createdEiere.length} eiere (owners)`);

        // STEP 3: Create Flokker (Herds)
        console.log("\n===== CREATING FLOKKER (HERDS) =====");
        const createdFlokker = await createFlokker(createdEiere, beiteområder);
        console.log(`Created ${createdFlokker.length} flokker (herds)`);

        // STEP 4: Create Reinsdyr (Reindeer)
        console.log("\n===== CREATING REINSDYR (REINDEER) =====");
        const createdReinsdyr = await createReinsdyr(createdFlokker);
        console.log(`Created ${createdReinsdyr.length} reinsdyr (reindeer)`);

        // Summary
        console.log("\n===== DATABASE INITIALIZATION COMPLETE =====");
        console.log("Created:");
        console.log(`- ${beiteområder.length} beiteområder`);
        console.log(`- ${createdEiere.length} eiere (owners)`);
        console.log(`- ${createdFlokker.length} flokker (herds)`);
        console.log(`- ${createdReinsdyr.length} reinsdyr (reindeer)`);

        // Show the created owners with their credentials
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
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

/**
 * Utility function to prompt for confirmation
 */
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

/**
 * Create all Beiteområde documents
 */
async function createBeiteområder() {
    // Get the primary grazing areas mapping
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

    // Create a document for each primary area
    for (const area of Object.keys(BEITEOMRÅDE_FYLKER_MAPPING)) {
        try {
            // Check if this area already exists
            const existing = await Beiteområde.findOne({ primærBeiteområde: area });

            if (existing) {
                console.log(`Beiteområde "${area}" already exists (ID: ${existing._id}). Using existing.`);
                beiteområder.push(existing);
                continue;
            }

            // Create new Beiteområde document
            const newArea = new Beiteområde({
                primærBeiteområde: area,
                // fylker will be auto-populated by the pre-save hook
                flokker: [], // Initially empty array of flokker (herds)
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

/**
 * Create owners
 */
async function createEiere() {
    const createdEiere = [];
    const saltRounds = 10; // Use an appropriate value here

    for (const eierData of eiere) {
        try {
            // Check if this owner already exists
            const existing = await Eier.findOne({ epost: eierData.epost });

            if (existing) {
                console.log(`Eier (owner) with email "${eierData.epost}" already exists (ID: ${existing._id}). Using existing.`);
                createdEiere.push(existing);
                continue;
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(eierData.passord, saltRounds);

            // Clean the phone number
            const cleanedPhone = eierData.telefon.replace(/\D/g, "");

            // Create a new owner
            const newEier = new Eier({
                navn: eierData.navn,
                epost: eierData.epost,
                passord: hashedPassword,
                telefon: cleanedPhone,
                kontaktspråk: eierData.kontaktspråk,
                flokker: [], // Initially empty array of herds
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

/**
 * Create herds for each owner
 */
async function createFlokker(eiere, beiteområder) {
    const createdFlokker = [];

    // Create 2 herds for each owner
    for (const eier of eiere) {
        for (let i = 0; i < 2; i++) {
            try {
                // Generate a unique name and serienummer for the herd
                const flokkNavnIndex = Math.floor(Math.random() * flokkNavn.length);
                const merkeNavnIndex = Math.floor(Math.random() * merkeNavn.length);
                const flokkSerienummer = `F-${uuidv4().substring(0, 8)}`;

                const navn = `${flokkNavn[flokkNavnIndex]} ${i + 1}`;
                const merke = `${merkeNavn[merkeNavnIndex]} ${i + 1}`;

                // Find appropriate beiteområde based on eier's kontaktspråk
                const beiteområde =
                    beiteområder.find((b) => b.primærBeiteområde === eier.kontaktspråk) || beiteområder[Math.floor(Math.random() * beiteområder.length)];

                // Create a mock merkeBildelenke (in a real app, you would have actual images)
                const merkeBildelenke = `/assets/icons/favicon.ico`;

                // Create the new herd
                const nyFlokk = new Flokk({
                    eierId: eier._id,
                    flokkNavn: navn,
                    flokkSerienummer: flokkSerienummer,
                    merkeNavn: merke,
                    merkeBildelenke: merkeBildelenke,
                    beiteområde: beiteområde._id,
                    reinsdyr: [], // Initially empty array of reindeer
                });

                await nyFlokk.save();

                // Update the owner with the new herd
                eier.flokker.push(nyFlokk._id);
                await eier.save();

                // Update the beiteområde with the new herd
                beiteområde.flokker.push(nyFlokk._id);
                await beiteområde.save();

                console.log(`Created new Flokk (herd): ${navn} (ID: ${nyFlokk._id}) for eier ${eier.navn}`);
                createdFlokker.push(nyFlokk);
            } catch (error) {
                console.error(`Error creating Flokk (herd) for eier ${eier.navn}:`, error.message);
            }
        }
    }

    return createdFlokker;
}

/**
 * Create reindeer for each herd
 */
async function createReinsdyr(flokker) {
    const createdReinsdyr = [];

    // Create 20 reindeer for each herd
    for (const flokk of flokker) {
        for (let i = 0; i < 20; i++) {
            try {
                // Generate a unique name and serienummer for the reindeer
                const reinsdyrNavnIndex = Math.floor(Math.random() * reinsdyrNavn.length);
                const navn = `${reinsdyrNavn[reinsdyrNavnIndex]} ${i + 1}`;
                const serienummer = `R-${uuidv4().substring(0, 8)}`;

                // Generate a random birthdate in the last 10 years
                const today = new Date();
                const tenYearsAgo = new Date();
                tenYearsAgo.setFullYear(today.getFullYear() - 10);

                const birthDate = new Date(tenYearsAgo.getTime() + Math.random() * (today.getTime() - tenYearsAgo.getTime()));

                // Create the new reindeer
                const nyReinsdyr = new Reinsdyr({
                    serienummer: serienummer,
                    navn: navn,
                    flokkId: flokk._id,
                    fødselsdato: birthDate,
                });

                await nyReinsdyr.save();

                // Update the herd with the new reindeer
                flokk.reinsdyr.push(nyReinsdyr._id);
                await flokk.save();

                // Log every 5th reindeer to avoid too much console output
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

// Execute the initialization function
initializeDatabase()
    .then(() => console.log("Database initialization completed"))
    .catch((err) => console.error("Database initialization failed:", err));
