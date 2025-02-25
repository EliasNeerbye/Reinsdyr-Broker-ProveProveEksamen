/**
 * Script to initialize and create all Beiteområde documents
 * based on the defined BEITEOMRÅDE_FYLKER_MAPPING
 */
require("dotenv").config()

const mongoose = require("mongoose");
const Beiteområde = require("./models/Beiteområde.js");

// Database connection parameters
const DB_URI =
    process.env.PROD_TRUE === "true"
        ? `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_IP}/reindeerBroker`
        : `mongodb://${process.env.MONGO_IP}/reindeerBroker`;
/**
 * Create all Beiteområde documents based on BEITEOMRÅDE_FYLKER_MAPPING
 */
async function createBeiteområder() {
    try {
        // Connect to MongoDB using latest Mongoose syntax
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB successfully");

        // Check if there are existing Beiteområde documents
        const existingCount = await Beiteområde.countDocuments();
        if (existingCount > 0) {
            console.log(`Found ${existingCount} existing Beiteområde documents.`);

            // Ask for confirmation before continuing
            const shouldContinue = await confirmContinue();
            if (!shouldContinue) {
                console.log("Operation cancelled by user.");
                return;
            }
        }

        // Get the primary grazing areas from your schema
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

        // Create a document for each primary area
        const createPromises = Object.keys(BEITEOMRÅDE_FYLKER_MAPPING).map(async (area) => {
            try {
                // Check if this area already exists
                const existing = await Beiteområde.findOne({ primærBeiteområde: area });

                if (existing) {
                    console.log(`Beiteområde "${area}" already exists (ID: ${existing._id}). Skipping.`);
                    return existing;
                }

                // Create new Beiteområde document
                // Note: The fylker field will be populated automatically by the pre-save hook
                const newArea = new Beiteområde({
                    primærBeiteområde: area,
                    // fylker will be auto-populated by the pre-save hook
                    flokker: [], // Initially empty array of flokker (herds)
                });

                await newArea.save();
                console.log(`Created new Beiteområde: ${area} (ID: ${newArea._id})`);
                return newArea;
            } catch (error) {
                console.error(`Error creating Beiteområde "${area}":`, error.message);
                throw error;
            }
        });

        // Wait for all areas to be created
        const results = await Promise.all(createPromises);

        // Log final results
        console.log("===== Creation Results =====");
        console.log(`Successfully created or verified ${results.length} Beiteområde documents`);

        // Display the created documents
        console.log("\n===== Beiteområde Documents =====");
        const allAreas = await Beiteområde.find().lean();
        allAreas.forEach((area) => {
            console.log(`${area.primærBeiteområde}:`);
            console.log(`  - ID: ${area._id}`);
            console.log(`  - Fylker: ${area.fylker.join(", ")}`);
            console.log(`  - Flokker count: ${area.flokker.length}`);
            console.log("");
        });
    } catch (error) {
        console.error("Error in Beiteområde creation process:", error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

/**
 * Utility function to prompt for confirmation in case of existing records
 * Note: This uses readline for Node.js environment
 */
function confirmContinue() {
    const readline = require("readline");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question("Existing Beiteområde documents found. Continue anyway? (y/n): ", (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === "y");
        });
    });
}

// Execute the creation function
createBeiteområder()
    .then(() => console.log("Script completed"))
    .catch((err) => console.error("Script failed:", err));
