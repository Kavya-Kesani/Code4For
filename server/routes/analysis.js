const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const OpenAI = require('openai');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get career analysis
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.profile) {
      return res.status(400).json({ msg: 'Please complete your profile first' });
    }

    const prompt = `Based on the following user profile, provide a personalized career re-entry analysis:

Previous Role: ${user.profile.previousRole}
Experience: ${user.profile.experience}
Career Break Duration: ${user.profile.careerBreakDuration}
Desired Career Path: ${user.profile.desiredCareerPath}
Current Skills: ${user.profile.skills?.join(', ') || 'None specified'}
Certifications: ${user.profile.certifications?.join(', ') || 'None specified'}

Please provide:
1. Skill gap analysis based on current industry requirements
2. Personalized learning roadmap with recommended certifications or courses
3. Suggestions for returnship programs or suitable job roles
4. Interview preparation guidance or skill refresh recommendations

Format the response as JSON with keys: skillGapAnalysis, learningRoadmap, jobSuggestions, interviewPrep`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert career counselor specializing in helping women return to the workforce after career breaks. Provide detailed, actionable advice." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    res.json(analysis);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;