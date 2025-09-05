import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

let openai = null;

if (apiKey) {
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
  });
} else {
  console.warn('OpenAI API key not found. Using mock responses.');
}

// Script generation service
export const scriptService = {
  async generateScript(scenario, state, userContext = {}) {
    if (!openai) {
      // Return mock script for development
      return {
        title: `${scenario} - ${state || 'General'}`,
        steps: [
          {
            action: 'Stay Calm',
            script: 'Remain calm and keep your hands visible at all times.',
            note: 'Your safety is the top priority.'
          },
          {
            action: 'Identify Yourself',
            script: 'Officer, I am going to comply with your lawful orders. May I ask why I was stopped?',
            note: 'Be polite but don\'t admit fault.'
          },
          {
            action: 'Exercise Rights',
            script: 'I am exercising my right to remain silent. I would like to speak with an attorney.',
            note: 'You can always invoke these rights.'
          }
        ],
        stateSpecific: state ? [
          `In ${state}, you have specific rights regarding police interactions.`,
          `${state} law requires officers to inform you of certain rights.`
        ] : [],
        disclaimer: 'This information is for educational purposes only and does not constitute legal advice.'
      };
    }

    try {
      const prompt = `Generate a detailed legal rights script for the following scenario:

Scenario: ${scenario}
State: ${state || 'General US'}
User Context: ${JSON.stringify(userContext)}

Please provide:
1. A step-by-step script with specific phrases to use
2. Important notes for each step
3. State-specific considerations if applicable
4. Safety reminders

Format the response as a JSON object with the following structure:
{
  "title": "Script title",
  "steps": [
    {
      "action": "Step name",
      "script": "Exact words to say",
      "note": "Important context or safety note"
    }
  ],
  "stateSpecific": ["State-specific information"],
  "disclaimer": "Legal disclaimer"
}

Focus on constitutional rights, de-escalation, and safety. Ensure all advice is legally sound and emphasizes compliance with lawful orders while protecting individual rights.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal rights educator providing accurate, constitutional information about interactions with law enforcement. Always emphasize safety, de-escalation, and compliance with lawful orders while protecting individual rights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating script:', error);
      // Fallback to mock data
      return this.generateScript(scenario, state, userContext);
    }
  },

  async generateLegalSummary(topic, state) {
    if (!openai) {
      return {
        title: topic,
        summary: `Legal information about ${topic} in ${state || 'the United States'}.`,
        keyPoints: [
          'Constitutional protections apply',
          'State laws may vary',
          'Consult with an attorney for specific guidance'
        ],
        disclaimer: 'This information is for educational purposes only.'
      };
    }

    try {
      const prompt = `Provide a concise legal summary for:

Topic: ${topic}
State: ${state || 'General US'}

Please provide:
1. A brief overview of the legal concept
2. Key rights and protections
3. State-specific variations if applicable
4. Practical implications

Format as JSON:
{
  "title": "Topic title",
  "summary": "Brief overview",
  "keyPoints": ["Key point 1", "Key point 2"],
  "stateSpecific": ["State-specific information"],
  "disclaimer": "Legal disclaimer"
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal educator providing accurate, educational information about US constitutional and state laws. Focus on individual rights and practical applications."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.2
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating legal summary:', error);
      return this.generateLegalSummary(topic, state);
    }
  }
};

// Emergency message generation
export const emergencyService = {
  async generateEmergencyMessage(location, userInfo, situation = 'general') {
    const defaultMessage = `🚨 EMERGENCY ALERT 🚨

I need immediate assistance. My current location is: ${location?.address || 'Location unavailable'}

Coordinates: ${location?.latitude || 'N/A'}, ${location?.longitude || 'N/A'}

Time: ${new Date().toLocaleString()}

Please contact me immediately or send help.

- ${userInfo?.name || 'GuardianGuide User'}`;

    if (!openai) {
      return defaultMessage;
    }

    try {
      const prompt = `Generate an emergency alert message for:

Situation: ${situation}
Location: ${JSON.stringify(location)}
User: ${JSON.stringify(userInfo)}

Create a clear, urgent message that:
1. Clearly indicates this is an emergency
2. Provides location information
3. Includes timestamp
4. Requests immediate assistance
5. Is concise but informative

Keep it under 160 characters if possible for SMS compatibility.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are creating emergency alert messages. Be clear, urgent, and concise. Include essential information for emergency responders."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.1
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating emergency message:', error);
      return defaultMessage;
    }
  }
};
