import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, Friendship, FriendRequest, FriendWithStats } from '@/types/friends';
import { toast } from 'sonner';

export function useFriends(userId?: string) {
  const [friends, setFriends] = useState<FriendWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    fetchFriends();
  }, [userId]);

  const fetchFriends = async () => {
    if (!userId) return;
    
    try {
      const { data: friendships, error: friendError } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

      if (friendError) throw friendError;

      const friendIds = friendships.map(f => 
        f.user_id === userId ? f.friend_id : f.user_id
      );

      if (friendIds.length === 0) {
        setFriends([]);
        setLoading(false);
        return;
      }

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', friendIds);

      if (profileError) throw profileError;

      // Get today's stats for each friend
      const today = new Date().toISOString().split('T')[0];
      const { data: stats } = await supabase
        .from('user_stats_history')
        .select('*')
        .in('user_id', friendIds)
        .eq('date', today);

      const friendsWithStats = profiles.map(profile => ({
        ...profile,
        stats: stats?.find(s => s.user_id === profile.id)
      }));

      setFriends(friendsWithStats);
    } catch (error: any) {
      console.error('Error fetching friends:', error);
      toast.error('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  return { friends, loading, refetch: fetchFriends };
}

export function useFriendRequests(userId?: string) {
  const [incoming, setIncoming] = useState<(FriendRequest & { from_user: Profile })[]>([]);
  const [outgoing, setOutgoing] = useState<(FriendRequest & { to_user: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    fetchRequests();
  }, [userId]);

  const fetchRequests = async () => {
    if (!userId) return;
    
    try {
      // Incoming requests
      const { data: incomingData, error: incomingError } = await supabase
        .from('friend_requests')
        .select('*, from_user:profiles!friend_requests_from_user_id_fkey(*)')
        .eq('to_user_id', userId)
        .eq('status', 'pending');

      if (incomingError) throw incomingError;

      // Outgoing requests
      const { data: outgoingData, error: outgoingError } = await supabase
        .from('friend_requests')
        .select('*, to_user:profiles!friend_requests_to_user_id_fkey(*)')
        .eq('from_user_id', userId)
        .eq('status', 'pending');

      if (outgoingError) throw outgoingError;

      setIncoming(incomingData as any);
      setOutgoing(outgoingData as any);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load friend requests');
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      const request = incoming.find(r => r.id === requestId);
      if (!request) return;

      // Update request status
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Create friendship
      const { error: friendshipError } = await supabase
        .from('friendships')
        .insert({
          user_id: request.to_user_id,
          friend_id: request.from_user_id
        });

      if (friendshipError) throw friendshipError;

      toast.success('Friend request accepted!');
      fetchRequests();
    } catch (error: any) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request');
    }
  };

  const declineRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'declined' })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Friend request declined');
      fetchRequests();
    } catch (error: any) {
      console.error('Error declining request:', error);
      toast.error('Failed to decline request');
    }
  };

  const cancelRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Friend request cancelled');
      fetchRequests();
    } catch (error: any) {
      console.error('Error cancelling request:', error);
      toast.error('Failed to cancel request');
    }
  };

  return { incoming, outgoing, loading, acceptRequest, declineRequest, cancelRequest, refetch: fetchRequests };
}
