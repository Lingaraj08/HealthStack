
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthContext';
import { ShieldAlert, Plus, Phone, UserRound, MapPin, Trash2, Pencil, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
}

const SosContacts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContact, setNewContact] = useState<Omit<EmergencyContact, 'id'>>({
    name: '',
    relation: '',
    phone: '',
    isPrimary: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch from Supabase
    const mockContacts = [
      { 
        id: '1', 
        name: 'Ramesh Kumar', 
        relation: 'Father', 
        phone: '+91 9876543210',
        isPrimary: true
      },
      { 
        id: '2', 
        name: 'Sunita Sharma', 
        relation: 'Mother', 
        phone: '+91 9876543211',
        isPrimary: false
      }
    ];
    
    setTimeout(() => {
      setContacts(mockContacts);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setNewContact(prev => ({
      ...prev,
      isPrimary: checked
    }));
  };
  
  const handleAddContact = () => {
    // Create new contact
    const id = Math.random().toString(36).substring(2, 9);
    
    let updatedContacts = [...contacts];
    
    // If new contact is primary, remove primary from others
    if (newContact.isPrimary) {
      updatedContacts = updatedContacts.map(contact => ({
        ...contact,
        isPrimary: false
      }));
    }
    
    // If no existing contacts and this is the first, mark as primary regardless
    const makePrimary = contacts.length === 0 ? true : newContact.isPrimary;
    
    const contact = {
      id,
      ...newContact,
      isPrimary: makePrimary
    };
    
    updatedContacts.push(contact);
    setContacts(updatedContacts);
    
    toast({
      title: "Contact added",
      description: `${newContact.name} has been added to your emergency contacts.`
    });
    
    setNewContact({
      name: '',
      relation: '',
      phone: '',
      isPrimary: false
    });
    
    setOpen(false);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setIsEditing(true);
    setEditingId(contact.id);
    setNewContact({
      name: contact.name,
      relation: contact.relation,
      phone: contact.phone,
      isPrimary: contact.isPrimary
    });
    setOpen(true);
  };
  
  const handleUpdateContact = () => {
    if (!editingId) return;
    
    let updatedContacts = [...contacts];
    
    // If updated contact is primary, remove primary from others
    if (newContact.isPrimary) {
      updatedContacts = updatedContacts.map(contact => ({
        ...contact,
        isPrimary: contact.id === editingId ? newContact.isPrimary : false
      }));
    }
    
    // Update the specific contact
    updatedContacts = updatedContacts.map(contact => {
      if (contact.id === editingId) {
        return {
          ...contact,
          name: newContact.name,
          relation: newContact.relation,
          phone: newContact.phone,
          isPrimary: newContact.isPrimary
        };
      }
      return contact;
    });
    
    setContacts(updatedContacts);
    
    toast({
      title: "Contact updated",
      description: `${newContact.name}'s information has been updated.`
    });
    
    // Reset form
    setNewContact({
      name: '',
      relation: '',
      phone: '',
      isPrimary: false
    });
    
    setIsEditing(false);
    setEditingId(null);
    setOpen(false);
  };
  
  const handleDeleteContact = (id: string) => {
    const contactToDelete = contacts.find(c => c.id === id);
    const wasPrimary = contactToDelete?.isPrimary;
    
    let updatedContacts = contacts.filter(contact => contact.id !== id);
    
    // If we deleted the primary contact and have other contacts, make the first one primary
    if (wasPrimary && updatedContacts.length > 0) {
      updatedContacts[0].isPrimary = true;
    }
    
    setContacts(updatedContacts);
    
    toast({
      title: "Contact removed",
      description: "The emergency contact has been removed from your list."
    });
  };
  
  const handleMakePrimary = (id: string) => {
    const updatedContacts = contacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === id
    }));
    
    setContacts(updatedContacts);
    
    toast({
      title: "Primary contact updated",
      description: "Your primary emergency contact has been updated."
    });
  };

  const handleSendSOS = () => {
    const primaryContact = contacts.find(c => c.isPrimary);
    
    if (!primaryContact) {
      toast({
        title: "No primary contact",
        description: "Please add at least one emergency contact to use the SOS feature.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would trigger an actual SOS alert
    toast({
      title: "SOS Alert Sent",
      description: `Emergency alert sent to ${primaryContact.name}`,
      variant: "default"
    });
  };

  const handleDialogClose = () => {
    if (open) {
      setOpen(false);
      setIsEditing(false);
      setEditingId(null);
      setNewContact({
        name: '',
        relation: '',
        phone: '',
        isPrimary: false
      });
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Emergency Contacts</h1>
            <p className="text-muted-foreground">
              Manage your emergency contacts for SOS alerts
            </p>
          </div>
          
          <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="health-button-primary mt-4 md:mt-0">
                <Plus className="mr-2 h-4 w-4" /> Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Emergency Contact' : 'Add Emergency Contact'}</DialogTitle>
                <DialogDescription>
                  {isEditing 
                    ? 'Update the details of your emergency contact.'
                    : 'Add someone who should be contacted in case of emergency.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newContact.name}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="relation" className="text-right">
                    Relation
                  </Label>
                  <Input
                    id="relation"
                    name="relation"
                    value={newContact.relation}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="e.g. Father, Mother, Spouse"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newContact.phone}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isPrimary" className="text-right">
                    Primary
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="isPrimary"
                      checked={newContact.isPrimary}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="isPrimary">Make primary contact</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                {isEditing ? (
                  <Button type="submit" onClick={handleUpdateContact}>Update Contact</Button>
                ) : (
                  <Button type="submit" onClick={handleAddContact}>Add Contact</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mb-8">
          <Card className="bg-red-50 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-700 flex items-center">
                <ShieldAlert className="mr-2 h-5 w-5" /> SOS Emergency Alert
              </CardTitle>
              <CardDescription className="text-red-600">
                Press the button below to send an emergency alert to your primary contact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white h-16 text-lg font-bold"
                onClick={handleSendSOS}
              >
                <ShieldAlert className="mr-2 h-6 w-6" /> SEND SOS ALERT
              </Button>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-healthBlue-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {contacts.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-12 w-12 text-yellow-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No emergency contacts added</h3>
                    <p className="text-muted-foreground mb-6">
                      Add emergency contacts to use the SOS feature
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="health-button-primary">
                          <Plus className="mr-2 h-4 w-4" /> Add Your First Contact
                        </Button>
                      </DialogTrigger>
                      {/* Dialog content same as above */}
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <Card key={contact.id} className={contact.isPrimary ? 'border-healthBlue-200 bg-healthBlue-50' : ''}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className={`h-10 w-10 rounded-full ${contact.isPrimary ? 'bg-healthBlue-100' : 'bg-gray-100'} flex items-center justify-center`}>
                            <UserRound className={`h-5 w-5 ${contact.isPrimary ? 'text-healthBlue-600' : 'text-gray-600'}`} />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-lg">{contact.name}</h3>
                              {contact.isPrimary && (
                                <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-healthBlue-100 text-healthBlue-700">
                                  Primary
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{contact.relation}</p>
                            <div className="flex items-center mt-1">
                              <Phone className="h-4 w-4 mr-1 text-gray-500" />
                              <span className="text-sm">{contact.phone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {!contact.isPrimary && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-gray-500 hover:text-healthBlue-500"
                              onClick={() => handleMakePrimary(contact.id)}
                              title="Set as primary"
                            >
                              <ShieldAlert className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-gray-500 hover:text-blue-500"
                            onClick={() => handleEditContact(contact)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
        
        <Card className="mt-8 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-700">
              <AlertTriangle className="mr-2 h-5 w-5" /> Important Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2 text-amber-700">
              <p>• Emergency contacts will receive SMS alerts with your location when you press the SOS button</p>
              <p>• Make sure your contacts' phone numbers are correct and include the country code</p>
              <p>• You can set one contact as "primary" who will be contacted first in emergencies</p>
              <p>• Your location will only be shared when you trigger an SOS alert</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SosContacts;
