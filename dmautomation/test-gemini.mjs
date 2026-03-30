import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyDm6uPModSrzUsaMxAu_n2GPxdvUtkXRjU");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

async function main() {
  try {
    const result = await model.generateContent("Write a short story");
    console.log(result.response.text());
  } catch (error) {
    console.error("Error connecting to Gemini API:", error);
  }
}

main();
