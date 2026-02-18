// ===========================================
// 📁 next-target-mock/server.js
// Next-Target Mock Server - ✅ מעודכן לפי המערכת המקורית
// ===========================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ===========================================
// חיבור ל-MongoDB
// ===========================================
mongoose
  .connect("mongodb://localhost:27017/next-target")
  .then(() => console.log("✅ Connected to Next-Target MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===========================================
// Schema: Manpower
// ===========================================
const manpowerSchema = new mongoose.Schema({
  pid: { type: String, required: true, unique: true },
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  battalion: { type: String, default: "" },
  company: { type: String, default: "" },
  platoon: { type: String, default: "" },
  serviceType: { type: String, default: "" },
  active: { type: Boolean, default: true },
  fullName: { type: String, default: "" },
  profession: [{ type: String }],
  notActiveDate: { type: Date, default: null },
  notActiveReason: { type: String, default: null },
  team: { type: String, default: "" },
  doctorDate: { type: Date, default: null },
  teamNumber: [{ type: Number }],
  number: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Manpower = mongoose.model("Manpower", manpowerSchema);

// ===========================================
// 🔍 API: /front - ✅ בדיוק כמו המערכת האמיתית
// ===========================================
app.get("/api/manpower/front", async (req, res) => {
  try {
    const { pid } = req.query;

    if (!pid) {
      return res.status(400).json({
        success: false,
        message: "מספר אישי חסר",
      });
    }

    console.log(`🔍 getFront - Searching for PID: ${pid}`);

    const person = await Manpower.findOne({ pid: pid.trim() });

    if (!person) {
      return res.status(404).json({
        success: false,
        message: "לא נמצא אדם עם מספר אישי זה",
      });
    }

    console.log(`✅ Found: ${person.fName} ${person.lName}`);

    // ✅ החזר את person ישירות כמו שהוא מגיע מ-MongoDB
    // זה כולל _id, __v, וכל השדות האחרים - בדיוק כמו המערכת האמיתית
    res.json(person);
  } catch (error) {
    console.error("❌ Error in getFront:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================================
// 🔍 API: חיפוש לפי מספר אישי (legacy)
// ===========================================
app.get("/api/manpowers/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    console.log(`🔍 Searching for PID: ${pid}`);

    const person = await Manpower.findOne({ pid: pid.trim() });

    if (!person) {
      return res.status(404).json({
        success: false,
        message: "לא נמצא אדם עם מספר אישי זה",
      });
    }

    console.log(`✅ Found: ${person.fName} ${person.lName}`);

    res.json({
      success: true,
      person: {
        pid: person.pid,
        firstName: person.fName,
        lastName: person.lName,
        battalion: person.battalion,
        company: person.company,
        platoon: person.platoon,
        serviceType: person.serviceType,
        team: person.team,
        number: person.number,
      },
    });
  } catch (error) {
    console.error("❌ Error searching for person:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================================
// 📝 API: הוספת אנשים
// ===========================================
app.post("/api/manpowers", async (req, res) => {
  try {
    const person = new Manpower(req.body);
    await person.save();

    res.status(201).json({
      success: true,
      person,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================================
// 📋 API: רשימת כל האנשים
// ===========================================
app.get("/api/manpowers", async (req, res) => {
  try {
    const people = await Manpower.find().sort({ lName: 1 });

    res.json({
      success: true,
      count: people.length,
      people,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================================
// 🌱 Seed: 20 אנשים אמיתיים
// ===========================================
app.post("/api/seed", async (req, res) => {
  try {
    await Manpower.deleteMany({});

    const realPeople = [
      {
        pid: "334455667",
        fName: "אריאל",
        lName: "חדד",
        battalion: "גדעון",
        company: "אלפא",
        platoon: "1",
        serviceType: "סדיר",
        active: true,
        fullName: "אריאל חדד",
        profession: ["לוחם חי״ר"],
        team: "ברק",
        teamNumber: [101, 102],
        number: "46601",
      },
      {
        pid: "223344556",
        fName: "אפרת",
        lName: "שלום",
        battalion: "רשף",
        company: "מסייעת",
        platoon: "3",
        serviceType: "קבע",
        active: true,
        fullName: "אפרת שלום",
        profession: ["קצינת שלישות"],
        team: "מטה",
        teamNumber: [201],
        number: "46602",
      },
      {
        pid: "335566778",
        fName: "בועז",
        lName: "יעקב",
        battalion: "צפע",
        company: "חוד",
        platoon: "2",
        serviceType: "מילואים",
        active: false,
        fullName: "בועז יעקב",
        profession: ["חובש"],
        team: "רפואה",
        teamNumber: [305, 306],
        number: "46603",
      },
      {
        pid: "201122334",
        fName: "דנה",
        lName: "אטיאס",
        battalion: "שקד",
        company: "מבצעית",
        platoon: "4",
        serviceType: "סדיר",
        active: true,
        fullName: "דנה אטיאס",
        profession: ["תצפיתנית"],
        team: "אופק",
        teamNumber: [401],
        number: "46604",
      },
      {
        pid: "304455669",
        fName: "הראל",
        lName: "מור",
        battalion: "עזוז",
        company: "ג׳",
        platoon: "1",
        serviceType: "קבע",
        active: true,
        fullName: "הראל מור",
        profession: ["מפקד צוות"],
        team: "סופה",
        teamNumber: [501, 502, 503, 504],
        number: "46605",
      },
      {
        pid: "318822334",
        fName: "ירדן",
        lName: "כהן",
        battalion: "בזק",
        company: "א׳",
        platoon: "2",
        serviceType: "סדיר",
        active: true,
        fullName: "ירדן כהן",
        profession: ["קשר"],
        team: "הדר",
        teamNumber: [601],
        number: "46606",
      },
      {
        pid: "209933445",
        fName: "לירז",
        lName: "אביטן",
        battalion: "צפע",
        company: "מסייעת",
        platoon: "3",
        serviceType: "מילואים",
        active: false,
        fullName: "לירז אביטן",
        profession: ["נהג בט״ש"],
        team: "לוגיסטיקה",
        teamNumber: [705],
        number: "46607",
      },
      {
        pid: "310022334",
        fName: "מאור",
        lName: "וקנין",
        battalion: "עשת",
        company: "מפקדה",
        platoon: "1",
        serviceType: "סדיר",
        active: true,
        fullName: "מאור וקנין",
        profession: ["טכנאי"],
        team: "חימוש",
        teamNumber: [801, 802],
        number: "46608",
      },
      {
        pid: "201133446",
        fName: "נטע",
        lName: "בר",
        battalion: "קרקאל",
        company: "ב׳",
        platoon: "4",
        serviceType: "סדיר",
        active: true,
        fullName: "נטע בר",
        profession: ["לוחמת"],
        team: "יהלום",
        teamNumber: [901],
        number: "46609",
      },
      {
        pid: "320044557",
        fName: "עידן",
        lName: "לוין",
        battalion: "נחשון",
        company: "חוד",
        platoon: "2",
        serviceType: "סדיר",
        active: true,
        fullName: "עידן לוין",
        profession: ["קלע"],
        team: "עורב",
        teamNumber: [101, 105],
        number: "46610",
      },
      {
        pid: "321155668",
        fName: "עדי",
        lName: "שרון",
        battalion: "אריות הירדן",
        company: "א׳",
        platoon: "3",
        serviceType: "קבע",
        active: true,
        fullName: "עדי שרון",
        profession: ["קצינת מבצעים"],
        team: "חמ״ל",
        teamNumber: [110],
        number: "46611",
      },
      {
        pid: "315577881",
        fName: "רפאל",
        lName: "גולן",
        battalion: "ברק",
        company: "ג׳",
        platoon: "2",
        serviceType: "סדיר",
        active: true,
        fullName: "רפאל גולן",
        profession: ["מטוליסט"],
        team: "חוד",
        teamNumber: [121, 122],
        number: "46612",
      },
      {
        pid: "301144558",
        fName: "שגיא",
        lName: "פרץ",
        battalion: "רמפה",
        company: "ב׳",
        platoon: "1",
        serviceType: "סדיר",
        active: false,
        fullName: "שגיא פרץ",
        profession: ["מש״ק תש"],
        team: "ת״ש",
        teamNumber: [130],
        number: "46613",
      },
      {
        pid: "204466779",
        fName: "תמי",
        lName: "כהן",
        battalion: "דוכיפת",
        company: "מסייעת",
        platoon: "3",
        serviceType: "קבע",
        active: true,
        fullName: "תמי כהן",
        profession: ["רס״פ"],
        team: "לוגיסטיקה",
        teamNumber: [141, 142, 143],
        number: "46614",
      },
      {
        pid: "328899001",
        fName: "אור",
        lName: "לוין",
        battalion: "שקד",
        company: "מבצעית",
        platoon: "2",
        serviceType: "סדיר",
        active: true,
        fullName: "אור לוין",
        profession: ["חובש קרבי"],
        team: "תאג״ד",
        teamNumber: [150],
        number: "46615",
      },
      {
        pid: "314455002",
        fName: "גיל",
        lName: "חן",
        battalion: "בזק",
        company: "א׳",
        platoon: "1",
        serviceType: "מילואים",
        active: true,
        fullName: "גיל חן",
        profession: ["נהג כבד"],
        team: "ניוד",
        teamNumber: [161],
        number: "46616",
      },
      {
        pid: "323344111",
        fName: "רועי",
        lName: "סבג",
        battalion: "נחשון",
        company: "חוד",
        platoon: "4",
        serviceType: "סדיר",
        active: true,
        fullName: "רועי סבג",
        profession: ["לוחם"],
        team: "נמר",
        teamNumber: [171, 172],
        number: "46617",
      },
      {
        pid: "229988112",
        fName: "שחר",
        lName: "ברק",
        battalion: "צפע",
        company: "מפקדה",
        platoon: "1",
        serviceType: "קבע",
        active: true,
        fullName: "שחר ברק",
        profession: ["קצין טכני"],
        team: "אחזקה",
        teamNumber: [180],
        number: "46618",
      },
      {
        pid: "320099883",
        fName: "דביר",
        lName: "עמר",
        battalion: "קרקאל",
        company: "ב׳",
        platoon: "2",
        serviceType: "סדיר",
        active: true,
        fullName: "דביר עמר",
        profession: ["מ״כ"],
        team: "הכשרה",
        teamNumber: [191, 192],
        number: "46619",
      },
      {
        pid: "314477884",
        fName: "ניתאי",
        lName: "גבאי",
        battalion: "עזוז",
        company: "ג׳",
        platoon: "3",
        serviceType: "סדיר",
        active: true,
        fullName: "ניתאי גבאי",
        profession: ["לוחם"],
        team: "אלון",
        teamNumber: [200],
        number: "46620",
      },
    ];

    await Manpower.insertMany(realPeople);

    res.json({
      success: true,
      message: `נוספו ${realPeople.length} אנשים`,
      count: realPeople.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================================
// 🗑️ API: ניקוי כל הנתונים
// ===========================================
app.delete("/api/manpowers", async (req, res) => {
  try {
    const result = await Manpower.deleteMany({});

    res.json({
      success: true,
      message: `נמחקו ${result.deletedCount} רשומות`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================================
// 🚀 Mass Seed: 5,000 אנשים
// ===========================================
app.post("/api/seed-heavy", async (req, res) => {
  try {
    console.log("⏳ Starting heavy seed of 5,000 records...");

    const firstNames = [
      "אבי",
      "בני",
      "גדי",
      "דן",
      "הראל",
      "וורד",
      "זיו",
      "חן",
      "טל",
      "יניב",
      "כפיר",
      "ליאור",
      "משה",
      "נועם",
      "עמית",
      "פנחס",
      "קובי",
      "רוני",
      "שחר",
      "תומר",
    ];
    const lastNames = [
      "כהן",
      "לוי",
      "מזרחי",
      "פרץ",
      "ביטון",
      "אברהם",
      "פרידמן",
      "עמר",
      "חדד",
      "גבאי",
      "וקנין",
      "שבתאי",
      "אלבז",
      "חן",
      "מור",
      "גולן",
      "סבג",
      "ברק",
      "אטיאס",
      "שרון",
    ];
    const battalions = [
      "גדעון",
      "רשף",
      "צפע",
      "שקד",
      "עזוז",
      "בזק",
      "קרקאל",
      "נחשון",
    ];
    const companies = [
      "אלפא",
      "מסייעת",
      "חוד",
      "מבצעית",
      "מפקדה",
      "א׳",
      "ב׳",
      "ג׳",
    ];
    const professions = [
      "לוחם",
      "חובש",
      "נהג",
      "קשר",
      "טכנאי",
      "מפקד",
      "מש״ק תש",
    ];

    const batchSize = 1000;
    let totalCreated = 0;

    for (let i = 0; i < 5; i++) {
      const bulkData = [];
      for (let j = 0; j < batchSize; j++) {
        const idNum = 1000000 + i * batchSize + j;
        const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lName = lastNames[Math.floor(Math.random() * lastNames.length)];

        bulkData.push({
          pid: idNum.toString(),
          fName: fName,
          lName: lName,
          battalion: battalions[Math.floor(Math.random() * battalions.length)],
          company: companies[Math.floor(Math.random() * companies.length)],
          platoon: Math.floor(Math.random() * 4 + 1).toString(),
          serviceType: Math.random() > 0.2 ? "סדיר" : "קבע",
          active: true,
          fullName: `${fName} ${lName}`,
          profession: [
            professions[Math.floor(Math.random() * professions.length)],
          ],
          team: "צוות " + Math.floor(Math.random() * 100 + 1),
          number: (50000 + totalCreated + j).toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      await Manpower.insertMany(bulkData);
      totalCreated += batchSize;
      console.log(`✅ Inserted ${totalCreated} records...`);
    }

    res.json({
      success: true,
      message: "נוספו 5,000 רשומות בהצלחה",
      count: totalCreated,
    });
  } catch (error) {
    console.error("❌ Error during heavy seed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===========================================
// Root endpoint
// ===========================================
app.get("/", (req, res) => {
  res.json({
    message: "Next-Target Mock API is running",
    endpoints: {
      front: "GET /api/manpower/front?pid=XXX",
      search: "GET /api/manpowers/:pid",
      list: "GET /api/manpowers",
      create: "POST /api/manpowers",
      seed: "POST /api/seed",
      seedHeavy: "POST /api/seed-heavy",
      deleteAll: "DELETE /api/manpowers",
    },
  });
});

// ===========================================
// Start Server
// ===========================================
app.listen(PORT, () => {
  console.log(`🚀 Next-Target Mock Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n💡 Seed data: POST http://localhost:${PORT}/api/seed`);
  console.log(`💡 Heavy seed: POST http://localhost:${PORT}/api/seed-heavy`);
  console.log(`💡 Clear data: DELETE http://localhost:${PORT}/api/manpowers`);
  console.log(
    `💡 Search: GET http://localhost:${PORT}/api/manpower/front?pid=334455667`
  );
});
