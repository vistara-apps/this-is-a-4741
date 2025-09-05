import React, { useState } from 'react';
import { Search, BookOpen, Scale, AlertCircle } from 'lucide-react';
import Card from './Card';

function LegalCheatSheet({ userState }) {
  const [searchTerm, setSearchTerm] = useState('');

  const legalTopics = [
    {
      id: 'fourth-amendment',
      title: 'Fourth Amendment Rights',
      category: 'Constitutional Rights',
      summary: 'Protection against unreasonable searches and seizures',
      content: [
        'Police need probable cause or a warrant to search you or your property',
        'You have the right to refuse consent to searches',
        'Evidence obtained illegally may be excluded from court',
        `In ${userState || 'most states'}, verbal consent must be clear and voluntary`
      ],
      icon: Scale
    },
    {
      id: 'fifth-amendment',
      title: 'Right to Remain Silent',
      category: 'Constitutional Rights',
      summary: 'Protection against self-incrimination',
      content: [
        'You have the right to remain silent during police questioning',
        'Anything you say can be used against you in court',
        'You can invoke this right at any time during an interaction',
        'Police must stop questioning if you clearly invoke this right'
      ],
      icon: BookOpen
    },
    {
      id: 'miranda-rights',
      title: 'Miranda Rights',
      category: 'Arrest Procedures',
      summary: 'Rights that must be read upon arrest',
      content: [
        'Right to remain silent',
        'Right to an attorney',
        'Right to have an attorney appointed if you cannot afford one',
        `${userState || 'State'} specific requirements for when Miranda must be read`
      ],
      icon: AlertCircle
    },
    {
      id: 'traffic-stops',
      title: 'Traffic Stop Rights',
      category: 'Vehicle Encounters',
      summary: 'Your rights during traffic stops',
      content: [
        'Provide license, registration, and insurance when requested',
        'You are not required to answer questions beyond identification',
        'Police need reasonable suspicion to extend the stop',
        `${userState || 'Your state'} may have specific laws about recording traffic stops`
      ],
      icon: Search
    }
  ];

  const filteredTopics = legalTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pt-6">
      <div className="px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Legal Cheat Sheet</h1>
        <p className="text-text-secondary">
          Quick reference for your rights and relevant laws
          {userState && ` in ${userState}`}
        </p>
      </div>

      {/* Search */}
      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search legal topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* State Banner */}
      {userState && (
        <div className="mx-4">
          <Card className="bg-blue-50 border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary">Information tailored for {userState}</h3>
                <p className="text-sm text-text-secondary">Laws may vary by jurisdiction within the state</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Legal Topics */}
      <div className="px-4 space-y-4">
        {filteredTopics.map((topic) => {
          const Icon = topic.icon;
          return (
            <Card key={topic.id} className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-text-primary">{topic.title}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-xs font-medium text-text-secondary rounded-full">
                      {topic.category}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">{topic.summary}</p>
                </div>
              </div>

              <div className="space-y-2">
                {topic.content.map((point, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-text-primary text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div className="px-4">
          <Card className="text-center py-8">
            <Search className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No results found</h3>
            <p className="text-text-secondary">Try searching for different terms or clear your search.</p>
          </Card>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mx-4">
        <Card className="bg-yellow-50 border border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-text-primary mb-1">Legal Disclaimer</h4>
              <p className="text-sm text-text-secondary">
                This information is for educational purposes only and does not constitute legal advice. 
                Laws vary by jurisdiction and change over time. Always consult with a qualified attorney 
                for specific legal guidance.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LegalCheatSheet;