
-- Create user_activities table to track all user activities
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  related_id UUID, -- Can reference any related record ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own activities" ON user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" ON user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" ON user_activities
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_activities_updated_at 
  BEFORE UPDATE ON user_activities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable real-time
ALTER TABLE user_activities REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE user_activities;

-- Create function to automatically create activity records
CREATE OR REPLACE FUNCTION create_activity_log(
  p_user_id UUID,
  p_activity_type TEXT,
  p_title TEXT,
  p_description TEXT,
  p_status TEXT,
  p_metadata JSONB DEFAULT '{}'::JSONB,
  p_related_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO user_activities (
    user_id, activity_type, title, description, status, metadata, related_id
  ) VALUES (
    p_user_id, p_activity_type, p_title, p_description, p_status, p_metadata, p_related_id
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

-- Create triggers on other tables to automatically log activities

-- Trigger for collection schedules
CREATE OR REPLACE FUNCTION log_collection_schedule_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM create_activity_log(
      NEW.user_id,
      'pickup_scheduled',
      'Pickup Scheduled',
      format('%s pickup scheduled for %s', NEW.collection_type, NEW.scheduled_date::TEXT),
      NEW.status::TEXT,
      jsonb_build_object('collection_id', NEW.id, 'location', NEW.location),
      NEW.id
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    PERFORM create_activity_log(
      NEW.user_id,
      'pickup_updated',
      'Pickup Status Updated',
      format('Pickup status changed to %s', NEW.status),
      NEW.status::TEXT,
      jsonb_build_object('collection_id', NEW.id, 'old_status', OLD.status),
      NEW.id
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER collection_schedule_activity_trigger
  AFTER INSERT OR UPDATE ON collection_schedules
  FOR EACH ROW EXECUTE FUNCTION log_collection_schedule_activity();

-- Trigger for marketplace items
CREATE OR REPLACE FUNCTION log_marketplace_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM create_activity_log(
      NEW.seller_id,
      'waste_listed',
      'Waste Item Listed',
      format('%s added to marketplace', NEW.item_name),
      NEW.status::TEXT,
      jsonb_build_object('item_id', NEW.id, 'material_type', NEW.material_type),
      NEW.id
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    PERFORM create_activity_log(
      NEW.seller_id,
      'item_status_changed',
      'Item Status Updated',
      format('%s status changed to %s', NEW.item_name, NEW.status),
      NEW.status::TEXT,
      jsonb_build_object('item_id', NEW.id),
      NEW.id
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER marketplace_activity_trigger
  AFTER INSERT OR UPDATE ON marketplace_items
  FOR EACH ROW EXECUTE FUNCTION log_marketplace_activity();

-- Trigger for plastic collections
CREATE OR REPLACE FUNCTION log_plastic_collection_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM create_activity_log(
      NEW.user_id,
      'plastic_collected',
      'Plastic Collection Submitted',
      format('%s plastic collection submitted for verification', NEW.collection_type),
      NEW.verification_status,
      jsonb_build_object('collection_id', NEW.id, 'quantity', NEW.quantity),
      NEW.id
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.verification_status != NEW.verification_status THEN
    PERFORM create_activity_log(
      NEW.user_id,
      'verification_updated',
      'Verification Status Updated',
      format('Plastic collection verification %s', NEW.verification_status),
      NEW.verification_status,
      jsonb_build_object('collection_id', NEW.id, 'credits_earned', NEW.credits_earned),
      NEW.id
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER plastic_collection_activity_trigger
  AFTER INSERT OR UPDATE ON plastic_collections
  FOR EACH ROW EXECUTE FUNCTION log_plastic_collection_activity();

-- Trigger for carbon credit trades
CREATE OR REPLACE FUNCTION log_carbon_trade_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Log for buyer
    PERFORM create_activity_log(
      NEW.buyer_id,
      'credit_purchased',
      'Carbon Credits Purchased',
      format('Purchased %s carbon credits', NEW.credits_amount),
      NEW.settlement_status,
      jsonb_build_object('trade_id', NEW.id, 'amount', NEW.total_amount),
      NEW.id
    );
    
    -- Log for seller
    PERFORM create_activity_log(
      NEW.seller_id,
      'credit_sold',
      'Carbon Credits Sold',
      format('Sold %s carbon credits', NEW.credits_amount),
      NEW.settlement_status,
      jsonb_build_object('trade_id', NEW.id, 'amount', NEW.total_amount),
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER carbon_trade_activity_trigger
  AFTER INSERT ON carbon_credit_trades
  FOR EACH ROW EXECUTE FUNCTION log_carbon_trade_activity();
