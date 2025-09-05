import React, { useState } from 'react';
import { ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';

function ScriptsSection({ userState }) {
  const [selectedScript, setSelectedScript] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const scriptCategories = [
    {
      id: 'traffic',
      title: 'Traffic Stop',
      description: 'What to say during a traffic stop',
      scenarios: ['Regular Traffic Stop', 'DUI Checkpoint', 'Search Request']
    },
    {
      id: 'questioning',
      title: 'Police Questioning',
      description: 'How to exercise your right to remain silent',
      scenarios: ['Street Questioning', 'Station Interview', 'Home Visit']
    },
    {
      id: 'search',
      title: 'Search Situations',
      description: 'Understanding consent and search rights',
      scenarios: ['Vehicle Search', 'Person Search', 'Home Search']
    },
    {
      id: 'arrest',
      title: 'Arrest Situations',
      description: 'What to do if you\'re being arrested',
      scenarios: ['During Arrest', 'After Arrest', 'Booking Process']
    }
  ];

  const getScript = (category, scenario) => {
    // Mock script data - in real app, this would come from API based on state
    return {
      title: `${scenario} - ${userState || 'General'}`,
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
        },
        {
          action: 'Document',
          script: 'I am not consenting to any searches. I am recording this interaction for my safety.',
          note: 'Clearly state your non-consent.'
        }
      ],
      stateSpecific: userState ? [
        `In ${userState}, you have specific rights regarding...`,
        `${userState} law requires officers to...`,
        `Special considerations for ${userState} residents:`
      ] : []
    };
  };

  const handlePlayAudio = () => {
    // Mock audio playback
    setIsPlaying(!isPlaying);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Rights Scripts</h1>
        <p className="text-text-secondary">
          Step-by-step guidance for interactions with law enforcement
          {userState && ` in ${userState}`}
        </p>
      </div>

      <div className="px-4 space-y-4">
        {scriptCategories.map((category) => (
          <Card key={category.id} className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-primary">{category.title}</h3>
                <p className="text-text-secondary mt-1">{category.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {category.scenarios.map((scenario, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedScript(getScript(category.id, scenario))}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-fast text-left"
                >
                  <span className="text-text-primary">{scenario}</span>
                  <ChevronRight className="w-4 h-4 text-text-secondary" />
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Script Modal */}
      <Modal 
        isOpen={!!selectedScript} 
        onClose={() => setSelectedScript(null)}
        title={selectedScript?.title}
        size="lg"
      >
        {selectedScript && (
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="accent"
                onClick={handlePlayAudio}
                className="flex items-center space-x-2"
              >
                {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlaying ? 'Stop Audio' : 'Play Audio'}</span>
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">Step-by-Step Guide:</h3>
              {selectedScript.steps.map((step, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary mb-2">{step.action}</h4>
                      <div className="bg-blue-50 p-3 rounded-md mb-2">
                        <p className="text-text-primary italic">"{step.script}"</p>
                      </div>
                      <p className="text-sm text-text-secondary">{step.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedScript.stateSpecific.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-text-primary">State-Specific Information:</h3>
                <div className="bg-green-50 p-4 rounded-md">
                  {selectedScript.stateSpecific.map((info, index) => (
                    <p key={index} className="text-text-primary mb-2 last:mb-0">• {info}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-sm text-text-primary">
                <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute legal advice. 
                Consult with a qualified attorney for specific legal guidance.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ScriptsSection;