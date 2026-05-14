import mongoose from "mongoose";
import dotenv from "dotenv";

// Load your environment variables (so it knows your MongoDB URI)
dotenv.config();

// Define a minimal version of the model just for the seeder
// Adjust this if your actual Mongoose model name/path is different
const WeightLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  weightKg: { type: Number, required: true },
  date: { type: Date, required: true },
});
const WeightLog = mongoose.models.WeightLog || mongoose.model("WeightLog", WeightLogSchema);

const TARGET_USER_ID = "6a061119a259c657a8323181";

// Your raw data pasted directly
const rawData = `26/1/26
102.6
27/1/26
103.2
28/1/26
102.6
29/1/26
102.4
30/1/26
103.3
31/1/26
103.4
1/2/26
102.5
2/2/26
101.9
3/2/26
102.3
4/2/26
102.1
5/2/26
102.2
6/2/26
103.3
7/2/26
102.9
8/2/26
101.7
9/2/26
101.8
10/2/26
102.2
11/2/26
101.7
12/2/26
102
13/2/26
102.6
14/2/26
102.6
15/2/26
102.5
16/2/26
101.9
17/2/26
102.1
18/2/26
102.1
19/2/26
103.1
20/2/26
102.7
21/2/26
102.2
22/2/26
101.8
23/2/26
102.1
24/2/26
102.2
25/2/26
102.2
26/2/26
101.8
27/2/26
101.5
28/2/26
101.5
1/3/26
101.4
2/3/26
102.3
3/3/26
101.8
4/3/26
101.3
5/3/26
101.8
6/3/26
102.3
7/3/26
103.4
8/3/26
101.9
9/3/26
101.5
10/3/26
101.5
11/3/26
101.2
12/3/26
101.2
13/3/26
100.8
14/3/26
100.8
15/3/26
100.8
16/3/26
100.8
17/3/26
100.8
18/3/26
100.8
19/3/26
100.8
20/3/26
100.8
21/3/26
100.8
22/3/26
100.8
23/3/26
100.8
24/3/26
100.8
25/3/26
100.8
26/3/26
100.8
27/3/26
100.8
28/3/26
100.8
29/3/26
100.8
30/3/26
100.8
31/3/26
100.8
1/4/26
100.8
2/4/26
100.8
3/4/26
100.8
4/4/26
100.8
5/4/26
100.8
6/4/26
100.8
7/4/26
100.8
8/4/26
100.8
9/4/26
100.8
10/4/26
103.6
11/4/26
103.6
12/4/26
103.6
13/4/26
103.6
14/4/26
103.6
15/4/26
103.6
16/4/26
103.6
17/4/26
103.6
18/4/26
103.6
19/4/26
103.6
20/4/26
103.6
21/4/26
103.6
22/4/26
103.6
23/4/26
103.6
24/4/26
103.6
25/4/26
103.6
26/4/26
103.6
27/4/26
103.6
28/4/26
103.6
29/4/26
103.6
30/4/26
103.6
1/5/26
103.1
2/5/26
102.1
3/5/26
103.1
4/5/26
103.7
5/5/26
103.7
6/5/26
103.1
7/5/26
102.7
8/5/26
103.1
9/5/26
102.9
10/5/26
102.9
11/5/26
102.5
12/5/26
102.2
13/5/26
102.9
14/5/26
103.4`;

const seedDatabase = async () => {
  try {
    // 1. Connect to the DB
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/weight-tracker";
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 2. Parse the raw string
    const lines = rawData.trim().split("\n");
    const bulkOperations = [];

    // The data format is Date on line i, Weight on line i+1
    for (let i = 0; i < lines.length; i += 2) {
      const dateStr = lines[i].trim();
      const weight = parseFloat(lines[i + 1].trim());

      // Convert "DD/MM/YY" into a standard Date object
      const [day, month, year] = dateStr.split("/");
      const fullYear = 2000 + parseInt(year);
      
      // Set to UTC midnight to avoid timezone shifting
      const dateObj = new Date(Date.UTC(fullYear, parseInt(month) - 1, parseInt(day)));

      // 3. Prepare the Upsert Operation
      // We use upsert so if you run this script twice, it doesn't create duplicate entries
      bulkOperations.push({
        updateOne: {
          filter: { date: dateObj, userId: TARGET_USER_ID },
          update: { 
            $set: { 
              weightKg: weight, 
              date: dateObj, 
              userId: TARGET_USER_ID 
            } 
          },
          upsert: true,
        },
      });
    }

    // 4. Execute the bulk write
    console.log(`⏳ Pushing ${bulkOperations.length} records to the database...`);
    const result = await WeightLog.bulkWrite(bulkOperations);
    
    console.log(`✅ Success! Upserted ${result.upsertedCount} new logs and updated ${result.modifiedCount} existing logs.`);

  } catch (error) {
    console.error("❌ Seeding Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Run the function
seedDatabase();