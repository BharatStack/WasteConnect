
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, MessageCircle } from 'lucide-react';
import { WasteListing } from '@/types/marketplace';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ContactDialogProps {
  listing: WasteListing;
  isOpen: boolean;
  onClose: () => void;
}

const ContactDialog = ({ listing, isOpen, onClose }: ContactDialogProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!user || !message.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('listing_messages')
        .insert({
          listing_id: listing.id,
          sender_id: user.id,
          receiver_id: listing.seller_id,
          message: message.trim(),
        });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Your message has been sent to the seller.",
      });

      setMessage('');
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{listing.title}</h3>
              <Badge variant="secondary">
                {listing.waste_category?.name.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            
            <p className="text-gray-600 mb-4">{listing.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">Quantity:</span>
                <p className="font-medium">{listing.quantity} {listing.unit}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Price:</span>
                <p className="font-medium">${listing.price_per_unit}/{listing.unit}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
              <MapPin className="h-4 w-4" />
              {listing.location}
            </div>

            <div className="text-sm text-gray-500 mb-4">
              {listing.pickup_available && "✓ Pickup Available"}
              {listing.pickup_available && listing.delivery_available && " • "}
              {listing.delivery_available && `✓ Delivery Available (${listing.delivery_radius}km radius)`}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I'm interested in your waste listing. Can you provide more details?"
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage} 
              disabled={!message.trim() || sending}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
