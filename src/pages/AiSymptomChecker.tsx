
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Activity, MessageSquare, Stethoscope, ChevronRight, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';

const AiSymptomChecker = () => {
  const { toast } = useToast();
  const [symptomInput, setSymptomInput] = useState('');
  const [conversation, setConversation] = useState<{role: 'ai' | 'user', content: string}[]>([
    { role: 'ai', content: 'Hello! I\'m your AI symptom checker. Please describe any symptoms you\'re experiencing, and I\'ll try to help you understand what might be happening. Note: This is not a substitute for professional medical advice.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendedDoctor, setRecommendedDoctor] = useState<{specialty: string, reason: string} | null>(null);

  const handleSendSymptoms = async () => {
    if (!symptomInput.trim()) return;
    
    // Add user message to conversation
    const userMessage = { role: 'user' as const, content: symptomInput };
    setConversation(prev => [...prev, userMessage]);
    setLoading(true);
    
    // Clear input
    setSymptomInput('');
    
    try {
      // Simulated AI response - in a real app, this would call an AI API
      setTimeout(() => {
        const symptoms = symptomInput.toLowerCase();
        let response: string;
        let showDoctor = false;
        let doctorSpecialty = '';
        let doctorReason = '';
        
        if (symptoms.includes('headache') || symptoms.includes('head pain') || symptoms.includes('migraine')) {
          response = "Headaches can have many causes, from tension and stress to more serious conditions. Based on your description, it sounds like you might be experiencing a tension headache. These are often caused by stress, poor posture, or eye strain. I recommend rest, hydration, and over-the-counter pain relievers if needed. If headaches persist for more than a few days, worsen significantly, or are accompanied by other symptoms like confusion or high fever, please consult a healthcare provider.";
          showDoctor = true;
          doctorSpecialty = "Neurologist";
          doctorReason = "For persistent or severe headaches that may require specialized evaluation";
        } else if (symptoms.includes('fever') || symptoms.includes('temperature')) {
          response = "Fever is your body's natural response to infection or illness. For adults, a temperature above 38°C (100.4°F) is generally considered a fever. Rest, hydration, and medication like acetaminophen can help manage the symptoms. However, if your fever persists beyond 3 days, exceeds 39.4°C (103°F), or is accompanied by severe symptoms like difficulty breathing, chest pain, or confusion, please seek immediate medical attention.";
          showDoctor = true;
          doctorSpecialty = "General Physician";
          doctorReason = "To evaluate the underlying cause of persistent fever";
        } else if (symptoms.includes('cough') || symptoms.includes('sore throat')) {
          response = "Your symptoms suggest an upper respiratory tract infection, which could be caused by a virus or bacteria. Most cases resolve with rest, hydration, and over-the-counter medications for symptom relief. If you experience difficulty breathing, high fever, or symptoms persist beyond 10 days, you should consult with a healthcare provider.";
          showDoctor = true;
          doctorSpecialty = "Pulmonologist";
          doctorReason = "For persistent respiratory symptoms that may require specialized care";
        } else if (symptoms.includes('stomach') || symptoms.includes('nausea') || symptoms.includes('vomit') || symptoms.includes('diarrhea')) {
          response = "Your symptoms suggest gastroenteritis or food poisoning. Most cases improve with rest, clear fluids, and a bland diet. Avoid dairy, caffeine, and fatty foods until symptoms improve. If you notice blood in your stool, severe abdominal pain, signs of dehydration, or symptoms last more than 3 days, please seek medical attention.";
          showDoctor = true;
          doctorSpecialty = "Gastroenterologist";
          doctorReason = "For digestive issues that may require specialized diagnosis and treatment";
        } else if (symptoms.includes('rash') || symptoms.includes('skin') || symptoms.includes('itch')) {
          response = "Skin rashes can have many causes including allergic reactions, infections, or underlying medical conditions. Based on your description, it could be contact dermatitis or a mild allergic reaction. Try to identify and avoid potential triggers, use mild soap, and consider over-the-counter antihistamines or hydrocortisone cream for itching. If the rash spreads, blisters, or is accompanied by other symptoms like fever or difficulty breathing, please seek immediate medical attention.";
          showDoctor = true;
          doctorSpecialty = "Dermatologist";
          doctorReason = "For persistent skin conditions requiring specialized evaluation";
        } else {
          response = "Thank you for describing your symptoms. While I can't provide a specific diagnosis, your symptoms could be related to various conditions. I recommend monitoring them and if they persist or worsen, consulting with a healthcare provider. Remember to stay hydrated and get adequate rest. Would you like information about any specific aspect of your symptoms or general health advice?";
          showDoctor = true;
          doctorSpecialty = "General Physician";
          doctorReason = "For a comprehensive evaluation of your symptoms";
        }
        
        const aiResponse = { role: 'ai' as const, content: response };
        setConversation(prev => [...prev, aiResponse]);
        setLoading(false);
        
        if (showDoctor) {
          setRecommendedDoctor({
            specialty: doctorSpecialty,
            reason: doctorReason
          });
          setShowRecommendation(true);
        }
      }, 1500);
    } catch (error) {
      console.error("Error processing symptoms:", error);
      toast({
        title: "Error",
        description: "Failed to process your symptoms. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendSymptoms();
    }
  };

  return (
    <Layout>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-2">AI Symptom Checker</h1>
        <p className="text-muted-foreground mb-6">
          Describe your symptoms and get AI-powered insights and recommendations
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-healthBlue-500" />
                  Symptom Analysis
                </CardTitle>
                <CardDescription>
                  Chat with our AI to understand your symptoms better
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto max-h-[500px] space-y-4">
                {conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      message.role === 'ai' 
                        ? 'bg-healthBlue-50 border border-healthBlue-100'
                        : 'bg-white border border-gray-200 ml-8'
                    }`}
                  >
                    {message.role === 'ai' && (
                      <div className="flex items-center mb-2 text-healthBlue-600">
                        <Stethoscope className="h-5 w-5 mr-2" />
                        <span className="font-semibold">AI Health Assistant</span>
                      </div>
                    )}
                    {message.role === 'user' && (
                      <div className="flex items-center mb-2 text-gray-700">
                        <MessageSquare className="h-5 w-5 mr-2" />
                        <span className="font-semibold">You</span>
                      </div>
                    )}
                    <p className="text-gray-700">{message.content}</p>
                    {message.role === 'ai' && index > 0 && (
                      <div className="flex items-center mt-3 space-x-2">
                        <Button variant="outline" size="sm" className="h-7">
                          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                          Helpful
                        </Button>
                        <Button variant="outline" size="sm" className="h-7">
                          <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                          Not helpful
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="p-4 rounded-lg bg-healthBlue-50 border border-healthBlue-100">
                    <div className="flex items-center mb-2 text-healthBlue-600">
                      <Stethoscope className="h-5 w-5 mr-2" />
                      <span className="font-semibold">AI Health Assistant</span>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <div className="h-2 w-2 bg-healthBlue-500 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-healthBlue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 bg-healthBlue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="flex w-full space-x-2">
                  <Textarea
                    placeholder="Describe your symptoms..."
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    className="flex-grow"
                  />
                  <Button 
                    onClick={handleSendSymptoms} 
                    disabled={!symptomInput.trim() || loading}
                    className="health-button-primary"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Important Notice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This AI symptom checker is for informational purposes only and does not provide medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.
                </p>
              </CardContent>
            </Card>

            {showRecommendation && recommendedDoctor && (
              <Card className="bg-healthBlue-50 border-healthBlue-200">
                <CardHeader>
                  <CardTitle className="text-healthBlue-700">Recommended Specialist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <p className="font-semibold text-lg text-healthBlue-700">{recommendedDoctor.specialty}</p>
                    <p className="text-sm text-gray-600">{recommendedDoctor.reason}</p>
                  </div>
                  <Button 
                    className="w-full health-button-primary" 
                    onClick={() => {
                      toast({
                        title: "Feature coming soon",
                        description: "Doctor recommendation and booking will be available in the next update.",
                      });
                    }}
                  >
                    Find a {recommendedDoctor.specialty} <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Common Symptom Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Respiratory", examples: "Cough, Shortness of breath" },
                  { name: "Digestive", examples: "Nausea, Abdominal pain" },
                  { name: "Skin & Hair", examples: "Rash, Itching" },
                  { name: "Neurological", examples: "Headache, Dizziness" },
                ].map((category, index) => (
                  <div 
                    key={index} 
                    className="p-2 border rounded-md cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => setSymptomInput(prev => `${prev} ${category.examples}`)}
                  >
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.examples}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AiSymptomChecker;
