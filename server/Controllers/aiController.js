import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

// ENHANCE PROFESSIONAL SUMMARY
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer. Enhance the professional summary into 1–2 ATS-friendly sentences. Return ONLY the text.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ENHANCE JOB DESCRIPTION
// POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer. Enhance the job description into 1–2 ATS-friendly sentences using action verbs and measurable results. Return ONLY the text.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// UPLOAD & PARSE RESUME
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt =
      "You are an AI that extracts structured data from resumes. You must return VALID JSON only. No markdown, no explanations.";

    const userPrompt = `
Extract structured data from the resume text below.

Return STRICT JSON in this format:

{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [],
  "projects": [],
  "education": []
}

Resume text:
${resumeText}
`;


    try {
//       const response = await ai.responses.create({
//   model: 'gpt-4-turbo',
//   messages: [
//     { role: 'system', content: 'You extract resume data and return only valid JSON.' },
//     { role: 'user', content: resumeText }
//   ],
//   response_format: { type: 'json_object' } // This helps ensure JSON output
// });

const response = await ai.responses.create({
  model: 'gpt-5.2',
  instructions: 'You are a coding assistant that talks like a pirate',
  input: 'Are semicolons optional in JavaScript?',
});

console.log(response);

const rawContent = response.choices[0].message.content;

            let parsedData;
            try {
            parsedData = JSON.parse(rawContent);
            } catch {
            return res.status(500).json({
                message: "AI returned invalid JSON. Please try again.",
            });
            }

            const newResume = await Resume.create({
            userId,
            title,
            ...parsedData,
            });

            return res.status(201).json({ resumeId: newResume._id });


    } catch (error) {
        console.log(error);
    }


   
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
