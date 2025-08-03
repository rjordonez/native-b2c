import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Warning, ArrowRight, Tag, User, Calendar, MessageCircle, TrendingUp } from 'phosphor-react';
import { supabase } from '../../../lib/supabase';

interface Ticket {
  id: string;
  ticket_number: number;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_on_user' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_email?: string;
  unread_count: number;
  message_count: number;
}

interface TicketStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  avg_resolution_time: string;
}

export const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          user:user_profiles!user_id(email),
          message_count:ticket_messages(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Calculate unread counts
      const ticketsWithUnread = await Promise.all(
        (data || []).map(async (ticket) => {
          const { count } = await supabase
            .from('ticket_messages')
            .select('*', { count: 'exact', head: true })
            .eq('ticket_id', ticket.id)
            .eq('read_by_user', false);
          
          return {
            ...ticket,
            user_email: ticket.user?.email,
            unread_count: count || 0,
            message_count: ticket.message_count?.[0]?.count || 0
          };
        })
      );

      setTickets(ticketsWithUnread);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: tickets, error } = await supabase
        .from('support_tickets')
        .select('status, created_at, resolved_at');

      if (error) throw error;

      const stats: TicketStats = {
        total: tickets?.length || 0,
        open: tickets?.filter(t => t.status === 'open').length || 0,
        in_progress: tickets?.filter(t => t.status === 'in_progress').length || 0,
        resolved: tickets?.filter(t => ['resolved', 'closed'].includes(t.status)).length || 0,
        avg_resolution_time: calculateAvgResolutionTime(tickets || [])
      };

      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const calculateAvgResolutionTime = (tickets: any[]): string => {
    const resolved = tickets.filter(t => t.resolved_at);
    if (resolved.length === 0) return 'N/A';

    const totalHours = resolved.reduce((sum, ticket) => {
      const created = new Date(ticket.created_at);
      const resolved = new Date(ticket.resolved_at);
      const hours = (resolved.getTime() - created.getTime()) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    const avgHours = totalHours / resolved.length;
    if (avgHours < 24) return `${Math.round(avgHours)}h`;
    return `${Math.round(avgHours / 24)}d`;
  };

  const updateTicketStatus = async (ticketId: string, status: Ticket['status']) => {
    try {
      const updates: any = { status };
      if (status === 'resolved' || status === 'closed') {
        updates.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', ticketId);

      if (error) throw error;
      
      await fetchTickets();
      await fetchStats();
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return <Clock className="text-blue-500" size={16} />;
      case 'in_progress':
        return <ArrowRight className="text-orange-500" size={16} />;
      case 'waiting_on_user':
        return <Warning className="text-yellow-500" size={16} />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="text-green-500" size={16} />;
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low': return 'text-gray-500';
      case 'medium': return 'text-blue-500';
      case 'high': return 'text-orange-500';
      case 'urgent': return 'text-red-500';
    }
  };

  const getStatusLabel = (status: Ticket['status']) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    if (filter === 'open') return ticket.status === 'open' || ticket.status === 'waiting_on_user';
    if (filter === 'in_progress') return ticket.status === 'in_progress';
    if (filter === 'resolved') return ticket.status === 'resolved' || ticket.status === 'closed';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tickets...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tickets</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <MessageCircle size={24} className="text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open</p>
                <p className="text-2xl font-semibold text-blue-600">{stats.open}</p>
              </div>
              <Clock size={24} className="text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-semibold text-orange-600">{stats.in_progress}</p>
              </div>
              <ArrowRight size={24} className="text-orange-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-semibold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle size={24} className="text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Resolution</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.avg_resolution_time}</p>
              </div>
              <TrendingUp size={24} className="text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-2">
          {(['all', 'open', 'in_progress', 'resolved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === f
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? 'All' : getStatusLabel(f as any)}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredTickets.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No tickets found
            </div>
          ) : (
            filteredTickets.map(ticket => (
              <div
                key={ticket.id}
                className="px-4 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">#{ticket.ticket_number}</span>
                      {getStatusIcon(ticket.status)}
                      <span className="text-xs text-gray-600">{getStatusLabel(ticket.status)}</span>
                      <Tag size={14} className={getPriorityColor(ticket.priority)} />
                      <span className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      {ticket.unread_count > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {ticket.unread_count} unread
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-1">{ticket.subject}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{ticket.user_email || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={12} />
                        <span>{ticket.message_count} messages</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 ml-4">
                    {ticket.status === 'open' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTicketStatus(ticket.id, 'in_progress');
                        }}
                        className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
                      >
                        Start
                      </button>
                    )}
                    {ticket.status === 'in_progress' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTicketStatus(ticket.id, 'resolved');
                        }}
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onStatusChange={(status) => {
            updateTicketStatus(selectedTicket.id, status);
            setSelectedTicket(null);
          }}
        />
      )}
    </div>
  );
};

// Ticket Detail Modal Component
const TicketDetailModal: React.FC<{
  ticket: Ticket;
  onClose: () => void;
  onStatusChange: (status: Ticket['status']) => void;
}> = ({ ticket, onClose, onStatusChange }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Ticket #{ticket.ticket_number}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Subject</label>
              <p className="font-medium">{ticket.subject}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-600">Description</label>
              <p className="text-gray-900">{ticket.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <select
                  value={ticket.status}
                  onChange={(e) => onStatusChange(e.target.value as Ticket['status'])}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_on_user">Waiting on User</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Priority</label>
                <p className="font-medium capitalize">{ticket.priority}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Category</label>
                <p className="font-medium">{ticket.category.replace(/_/g, ' ')}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Created</label>
                <p className="font-medium">{new Date(ticket.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;