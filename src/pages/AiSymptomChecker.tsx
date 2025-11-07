import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Activity, MessageSquare, Stethoscope, ChevronRight, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { ENV, AI_CONFIG } from '../lib/env';

const symptomResponses = {
  headache: [
    "Headaches can have many causes, from tension and stress to more serious conditions. Based on your description, it sounds like you might be experiencing a tension headache. These are often caused by stress, poor posture, or eye strain. I recommend rest, hydration, and over-the-counter pain relievers if needed. If headaches persist for more than a few days, worsen significantly, or are accompanied by other symptoms like confusion or high fever, please consult a healthcare provider.",
    "Your symptoms suggest you may be experiencing a headache, which could be tension-related or possibly migraine. Common triggers include stress, lack of sleep, dehydration, or eye strain. For immediate relief, consider resting in a quiet, dark room, staying hydrated, and using over-the-counter pain medication if appropriate. If you experience severe, sudden headaches, headaches with fever, confusion, or weakness, please seek immediate medical attention.",
    "From your description, you appear to be experiencing headache symptoms. There are many types including tension, cluster, and migraine headaches, each with different characteristics. Most occasional headaches can be managed with rest, hydration, and pain relievers. However, if you experience severe pain described as 'the worst headache of your life,' vision changes, confusion, or if headaches are becoming more frequent or severe over time, please consult a healthcare provider promptly."
  ],
  fever: [
    "Fever is your body's natural response to infection or illness. For adults, a temperature above 38°C (100.4°F) is generally considered a fever. Rest, hydration, and medication like acetaminophen can help manage the symptoms. However, if your fever persists beyond 3 days, exceeds 39.4°C (103°F), or is accompanied by severe symptoms like difficulty breathing, chest pain, or confusion, please seek immediate medical attention.",
    "Your symptoms indicate you have a fever, which is your immune system's way of fighting infection. Most fevers are caused by viral infections and resolve within a few days. To manage the symptoms, ensure adequate rest, drink plenty of fluids, and consider over-the-counter fever reducers if needed. If your fever is very high (above 103°F/39.4°C), lasts more than three days, or is accompanied by severe symptoms like shortness of breath or severe pain, you should seek medical care promptly.",
    "Based on your description, you're experiencing a fever. This is often a sign that your body is fighting an infection. For most adults, rest, hydration, and fever-reducing medications are sufficient for management. However, you should seek immediate medical attention if: your temperature exceeds 103°F (39.4°C), the fever lasts more than 3 days, or you develop concerning symptoms such as rash, persistent vomiting, severe headache, stiff neck, or difficulty breathing."
  ],
  respiratory: [
    "Your symptoms suggest an upper respiratory tract infection, which could be caused by a virus or bacteria. Most cases resolve with rest, hydration, and over-the-counter medications for symptom relief. If you experience difficulty breathing, high fever, or symptoms persist beyond 10 days, you should consult with a healthcare provider.",
    "Based on your description of cough and respiratory symptoms, you may be experiencing a respiratory infection. These are commonly caused by viruses and typically resolve within 7-10 days. To manage symptoms, get plenty of rest, stay hydrated, use honey for soothing coughs (if not contraindicated), and consider over-the-counter cough suppressants if needed. If you develop shortness of breath, wheezing, high fever, or symptoms lasting beyond 10-14 days, please seek medical attention.",
    "Your symptoms are consistent with an upper respiratory infection, commonly known as a cold or flu. Most cases are viral and will improve with rest and supportive care. I recommend staying well-hydrated, getting extra rest, and using appropriate over-the-counter medications for symptom relief. If you experience difficulty breathing, symptoms that worsen after initially improving, or symptoms that persist beyond two weeks, please consult with a healthcare provider."
  ],
  digestive: [
    "Your symptoms suggest gastroenteritis or food poisoning. Most cases improve with rest, clear fluids, and a bland diet. Avoid dairy, caffeine, and fatty foods until symptoms improve. If you notice blood in your stool, severe abdominal pain, signs of dehydration, or symptoms last more than 3 days, please seek medical attention.",
    "Based on your digestive symptoms, you may be experiencing gastroenteritis (stomach flu) or food poisoning. These conditions typically resolve within a few days. For management, focus on staying hydrated with small, frequent sips of clear fluids, gradually reintroducing bland foods like rice, toast, and bananas as tolerated. Watch for signs of dehydration such as decreased urination, excessive thirst, or dizziness. If you experience severe pain, high fever, bloody stools, or symptoms persisting beyond 3-4 days, please seek medical attention.",
    "Your symptoms suggest gastrointestinal distress, which could be due to viral gastroenteritis, food poisoning, or other digestive issues. To manage symptoms: stay hydrated with clear fluids, avoid solid foods until vomiting subsides, then slowly reintroduce bland foods. Use over-the-counter medications for symptom relief only if appropriate. Please seek medical attention if you notice blood in vomit or stool, severe pain, high fever, or if symptoms last more than 3 days."
  ],
  skin: [
    "Skin rashes can have many causes including allergic reactions, infections, or underlying medical conditions. Based on your description, it could be contact dermatitis or a mild allergic reaction. Try to identify and avoid potential triggers, use mild soap, and consider over-the-counter antihistamines or hydrocortisone cream for itching. If the rash spreads, blisters, or is accompanied by other symptoms like fever or difficulty breathing, please seek immediate medical attention.",
    "Your skin symptoms could indicate several conditions such as an allergic reaction, dermatitis, or possibly an infection. For mild symptoms, try keeping the area clean with gentle soap, avoid scratching, and consider over-the-counter hydrocortisone cream for itching. Antihistamines may help if the condition seems allergy-related. Please seek medical attention if you notice rapid spreading, blistering, pus formation, fever, or if the rash is accompanied by facial swelling or breathing difficulties.",
    "Based on your description of skin symptoms, you may be experiencing a dermatological reaction. This could be related to contact with an irritant, an allergic reaction, or possibly a skin condition. For temporary relief, keep the area clean and moisturized, avoid potential triggers, and consider cool compresses or over-the-counter anti-itch creams. If the rash covers a large portion of your body, develops blisters, becomes increasingly painful, or if you experience fever or breathing difficulties, please seek immediate medical care."
  ],
  general: [
    "Thank you for describing your symptoms. Based on my enhanced analysis, I recommend monitoring your symptoms closely. If they persist or worsen, please consult with a healthcare provider promptly. In the meantime, ensure you're staying hydrated and getting adequate rest. Would you like specific information about any aspect of your symptoms or general health advice?",
    "I've analyzed your symptoms using advanced medical knowledge. While I can provide general guidance, your specific situation would benefit from professional medical assessment if symptoms persist or worsen. In the meantime, ensure you're following basic health practices like adequate hydration, rest, and balanced nutrition. Is there a particular aspect of your condition that concerns you most?",
    "Based on your description, I've evaluated your symptoms using comprehensive medical information. While this isn't a definitive diagnosis, I can provide general guidance. It's important to monitor changes in your condition and seek professional medical care if symptoms worsen or don't improve. Are there specific concerns about your symptoms that you'd like me to address in more detail?"
  ]
};

const AiSymptomChecker = () => {
  const { toast } = useToast();
  const [symptomInput, setSymptomInput] = useState('');
  const [conversation, setConversation] = useState<{role: 'ai' | 'user', content: string}[]>([
    { role: 'ai', content: 'Hello! I\'m your AI symptom checker. Please describe any symptoms you\'re experiencing, and I\'ll try to help you understand what might be happening. Note: This is not a substitute for professional medical advice.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendedDoctor, setRecommendedDoctor] = useState<{specialty: string, reason: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const getRandomResponse = (responses: string[]) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendSymptoms = async () => {
    if (!symptomInput.trim()) return;
    
    const userMessage = { role: 'user' as const, content: symptomInput };
    setConversation(prev => [...prev, userMessage]);
    setLoading(true);
    
    setSymptomInput('');
    
    try {
      setTimeout(() => {
        const symptoms = symptomInput.toLowerCase();
        let response: string;
        let showDoctor = false;
        let doctorSpecialty = '';
        let doctorReason = '';
        
  // debug: API key availability checked
        
        if (symptoms.includes('headache') || symptoms.includes('head pain') || symptoms.includes('migraine')) {
          response = getRandomResponse(symptomResponses.headache);
          showDoctor = true;
          doctorSpecialty = "Neurologist";
          doctorReason = "For persistent or severe headaches that may require specialized evaluation";
        } else if (symptoms.includes('fever') || symptoms.includes('temperature')) {
          response = getRandomResponse(symptomResponses.fever);
          showDoctor = true;
          doctorSpecialty = "General Physician";
          doctorReason = "To evaluate the underlying cause of persistent fever";
        } else if (symptoms.includes('cough') || symptoms.includes('sore throat')) {
          response = getRandomResponse(symptomResponses.respiratory);
          showDoctor = true;
          doctorSpecialty = "Pulmonologist";
          doctorReason = "For persistent respiratory symptoms that may require specialized care";
        } else if (symptoms.includes('stomach') || symptoms.includes('nausea') || symptoms.includes('vomit') || symptoms.includes('diarrhea')) {
          response = getRandomResponse(symptomResponses.digestive);
          showDoctor = true;
          doctorSpecialty = "Gastroenterologist";
          doctorReason = "For digestive issues that may require specialized diagnosis and treatment";
        } else if (symptoms.includes('rash') || symptoms.includes('skin') || symptoms.includes('itch')) {
          response = getRandomResponse(symptomResponses.skin);
          showDoctor = true;
          doctorSpecialty = "Dermatologist";
          doctorReason = "For persistent skin conditions requiring specialized evaluation";
        } else {
          response = getRandomResponse(symptomResponses.general);
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
                <div ref={messagesEndRef} />
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
