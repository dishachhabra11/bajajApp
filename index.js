import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mime from "mime";
import { fileTypeFromBuffer } from "file-type";
import { isPrime } from "./utils/isPrime.js";

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  // Input validation
  if (!data || !Array.isArray(data)) {
    return res.status(400).json({
      is_success: false,
      message: "Invalid input. 'data' must be an array.",
    });
  }

  // Separate numbers and alphabets
  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => isNaN(item));

  // Find the highest lowercase alphabet
  const lowercaseAlphabets = alphabets.filter((char) => char === char.toLowerCase());
  const highestLowercaseAlphabet = lowercaseAlphabets.sort().slice(-1);

  // Check if any number is prime
  const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };
  const isPrimeFound = numbers.some((num) => isPrime(Number(num)));

  // File handling logic
  let fileValid = false;
  let fileMimeType = null;
  let fileSizeKB = null;

  if (file_b64) {
    try {
      const mimeMatch = file_b64.match(/^data:(.*?);base64,/);
      if (mimeMatch && mimeMatch[1]) {
        fileMimeType = mimeMatch[1];
        const base64Data = file_b64.replace(/^data:.*;base64,/, "");
        const binaryData = Buffer.from(base64Data, "base64");
        fileSizeKB = Math.ceil(binaryData.length / 1024);
        fileValid = true;
      }
    } catch (error) {
      console.error("Error processing file:", error);
    }
  }

  // Response payload
  res.json({
    is_success: true,
    user_id: "dishachhabra_20032003",
    email: "dishachhabra210211@acropolis.in",
    roll_number: "0827CS211078",
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
    is_prime_found: isPrimeFound,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKB,
  });
});

app.listen(port, () => {
  console.log("Server is running on port 5000");
});
