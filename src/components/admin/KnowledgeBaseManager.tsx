
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, BookOpen, Tag } from 'lucide-react';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[] | null;
  is_active: boolean;
  created_at: string;
}

const KnowledgeBaseManager = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    source_url: ''
  });
  const { toast } = useToast();

  const loadKnowledgeItems = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ai_knowledge_base')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading knowledge items:', error);
      toast({
        title: "Error",
        description: "Failed to load knowledge base items.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addKnowledgeItem = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : null;

      const { error } = await supabase
        .from('ai_knowledge_base')
        .insert({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category.trim() || null,
          tags: tagsArray,
          source_url: formData.source_url.trim() || null,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Knowledge item added successfully.",
      });

      setFormData({
        title: '',
        content: '',
        category: '',
        tags: '',
        source_url: ''
      });

      loadKnowledgeItems();
    } catch (error) {
      console.error('Error adding knowledge item:', error);
      toast({
        title: "Error",
        description: "Failed to add knowledge item.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadKnowledgeItems();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Knowledge Base Item
          </CardTitle>
          <CardDescription>
            Add content to enhance the AI assistant's knowledge about waste management.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Electronic Waste Disposal Guidelines"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Detailed information about the topic..."
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Disposal, Recycling, Compliance"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., electronics, hazardous, recycling"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Source URL (optional)</label>
            <Input
              value={formData.source_url}
              onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
              placeholder="https://example.com/source"
            />
          </div>
          
          <Button onClick={addKnowledgeItem} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Knowledge Item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Knowledge Base Items ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500">No knowledge items yet.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="border-l-4 border-l-eco-green-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <Badge variant={item.is_active ? "default" : "secondary"}>
                        {item.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-3">{item.content}</p>
                    
                    <div className="flex flex-wrap gap-2 items-center">
                      {item.category && (
                        <Badge variant="outline">{item.category}</Badge>
                      )}
                      
                      {item.tags && item.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-2">
                      Added on {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBaseManager;
