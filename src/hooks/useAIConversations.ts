
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIConversation {
  id: string;
  session_id: string;
  question: string;
  response: string | null;
  context_used: string | null;
  language: string;
  created_at: string;
}

interface KnowledgeBaseItem {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[] | null;
}

export const useAIConversations = () => {
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Generate a session ID for grouping related conversations
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Load knowledge base items
  const loadKnowledgeBase = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_knowledge_base')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKnowledgeBase(data || []);
    } catch (error) {
      console.error('Error loading knowledge base:', error);
    }
  };

  // Find relevant context from knowledge base
  const findRelevantContext = (question: string): string => {
    const questionLower = question.toLowerCase();
    const relevantItems = knowledgeBase.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(questionLower);
      const contentMatch = item.content.toLowerCase().includes(questionLower);
      const tagMatch = item.tags?.some(tag => 
        questionLower.includes(tag.toLowerCase()) || 
        tag.toLowerCase().includes(questionLower)
      );
      return titleMatch || contentMatch || tagMatch;
    });

    return relevantItems
      .slice(0, 3) // Limit to top 3 relevant items
      .map(item => `${item.title}: ${item.content}`)
      .join('\n\n');
  };

  // Save conversation to database
  const saveConversation = async (
    sessionId: string,
    question: string,
    response: string,
    context: string,
    language: string = 'en'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          question,
          response,
          context_used: context,
          language
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving conversation:', error);
      toast({
        title: "Warning",
        description: "Conversation could not be saved, but your chat will continue to work.",
        variant: "default",
      });
    }
  };

  // Load user's conversation history
  const loadConversations = async (sessionId?: string) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKnowledgeBase();
  }, []);

  return {
    conversations,
    knowledgeBase,
    isLoading,
    generateSessionId,
    findRelevantContext,
    saveConversation,
    loadConversations,
    loadKnowledgeBase
  };
};
