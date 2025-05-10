import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import "dotenv/config";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error("Missing required environment variables SUPABASE_URL and/or SUPABASE_KEY");
}

const supabase = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const testPoints = [
  {
    name: "Spine Point",
    description: "Reflex point for the entire spine, helps with back pain and flexibility",
    anatomical_system: "musculoskeletal",
    coordinates: { x: 0.5, y: 0.3 },
    contraindications: ["acute back injury", "spinal surgery"],
  },
  {
    name: "Stomach Point",
    description: "Reflex point for digestive system, helps with stomach issues",
    anatomical_system: "digestive",
    coordinates: { x: 0.4, y: 0.6 },
    contraindications: ["acute gastritis", "stomach ulcers"],
  },
  {
    name: "Head Point",
    description: "Reflex point for head and brain, helps with headaches and stress",
    anatomical_system: "nervous",
    coordinates: { x: 0.7, y: 0.2 },
    contraindications: ["head injury", "migraine"],
  },
  {
    name: "Hip Point",
    description: "Reflex point for hip joints, helps with mobility and pain",
    anatomical_system: "musculoskeletal",
    coordinates: { x: 0.3, y: 0.5 },
    contraindications: ["hip surgery", "acute hip injury"],
  },
  {
    name: "Liver Point",
    description: "Reflex point for liver function, helps with detoxification",
    anatomical_system: "digestive",
    coordinates: { x: 0.6, y: 0.4 },
    contraindications: ["liver disease", "jaundice"],
  },
  {
    name: "Neck Point",
    description: "Reflex point for neck tension and stiffness",
    anatomical_system: "musculoskeletal",
    coordinates: { x: 0.5, y: 0.4 },
    contraindications: ["neck injury", "cervical issues"],
  },
  {
    name: "Intestine Point",
    description: "Reflex point for intestinal health and digestion",
    anatomical_system: "digestive",
    coordinates: { x: 0.4, y: 0.7 },
    contraindications: ["intestinal inflammation", "bowel obstruction"],
  },
  {
    name: "Brain Point",
    description: "Reflex point for cognitive function and mental clarity",
    anatomical_system: "nervous",
    coordinates: { x: 0.8, y: 0.3 },
    contraindications: ["brain injury", "seizures"],
  },
  {
    name: "Shoulder Point",
    description: "Reflex point for shoulder mobility and pain relief",
    anatomical_system: "musculoskeletal",
    coordinates: { x: 0.6, y: 0.5 },
    contraindications: ["shoulder surgery", "rotator cuff injury"],
  },
  {
    name: "Pancreas Point",
    description: "Reflex point for blood sugar regulation",
    anatomical_system: "digestive",
    coordinates: { x: 0.5, y: 0.6 },
    contraindications: ["pancreatitis", "diabetes"],
  },
];

async function seedDatabase() {
  try {
    // First, clear existing data
    const { error: deleteError } = await supabase
      .from("reflexology_points")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all records

    if (deleteError) {
      throw deleteError;
    }

    // Insert new test data
    const { data, error: insertError } = await supabase.from("reflexology_points").insert(testPoints).select();

    if (insertError) {
      throw insertError;
    }

    console.log("Successfully seeded database with test data:", data);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seed function
seedDatabase();
