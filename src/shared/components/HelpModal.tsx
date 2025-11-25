import React, { useEffect, useState } from 'react';
import { X, Plus, Clock, CheckCircle, Warning, ArrowRight, Tag, ChatCircle } from 'phosphor-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectHelpModalOpen, setHelpModalOpen, toggleHelpModal } from '../../store/slices/navigationSlice';

interface Ticket {
  id: string;
  ticketNumber: number;
  subject: string;
  status: 'open' | 'in_progress' | 'waiting_on_user' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
}

const HelpModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectHelpModalOpen);
  const [activeTab, setActiveTab] = useState<'new' | 'tickets'>('new');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for new ticket
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general_help',
    priority: 'medium',
    description: ''
  });

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + / to toggle help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        dispatch(toggleHelpModal());
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        dispatch(setHelpModalOpen(false));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(setHelpModalOpen(false));
  };

  const handleSubmitTicket = async () => {
    setIsSubmitting(true);
    // TODO: Submit ticket to backend
    console.log('Submitting ticket:', formData);
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveTab('tickets');
      // Reset form
      setFormData({
        subject: '',
        category: 'general_help',
        priority: 'medium',
        description: ''
      });
    }, 1000);
  };

  const categories = [
    { value: 'technical_issue', label: 'Technical Issue' },
    { value: 'account_problem', label: 'Account Problem' },
    { value: 'billing_question', label: 'Billing Question' },
    { value: 'feature_request', label: 'Feature Request' },
    { value: 'pronunciation_issue', label: 'Pronunciation Issue' },
    { value: 'transcription_issue', label: 'Transcription Issue' },
    { value: 'scoring_question', label: 'Scoring Question' },
    { value: 'general_help', label: 'General Help' },
    { value: 'bug_report', label: 'Bug Report' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-gray-500' },
    { value: 'medium', label: 'Medium', color: 'text-blue-500' },
    { value: 'high', label: 'High', color: 'text-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-500' }
  ];

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

  const getStatusLabel = (status: Ticket['status']) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Support</h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'new' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Plus size={16} className="inline mr-1" />
              New Ticket
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'tickets' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Tickets
            </button>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-180px)]">
            {activeTab === 'new' ? (
              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); handleSubmitTicket(); }}>
                  <div className="space-y-4">
                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <div className="flex gap-2">
                        {priorities.map(priority => (
                          <button
                            key={priority.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, priority: priority.value as any })}
                            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                              formData.priority === priority.value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {priority.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        rows={6}
                        placeholder="Please provide detailed information about your issue..."
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Include steps to reproduce, error messages, and any other relevant details
                      </p>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setActiveTab('tickets')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.subject || !formData.description}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-6">
                {tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <ChatCircle size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets yet</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      When you submit a support request, it will appear here
                    </p>
                    <button
                      onClick={() => setActiveTab('new')}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Create New Ticket
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-500">#{ticket.ticketNumber}</span>
                              {getStatusIcon(ticket.status)}
                              <span className="text-xs text-gray-600">{getStatusLabel(ticket.status)}</span>
                              {ticket.unreadCount > 0 && (
                                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                                  {ticket.unreadCount} new
                                </span>
                              )}
                            </div>
                            <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>Updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Tag size={16} className={priorities.find(p => p.value === ticket.priority)?.color} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Response time: Usually within 24 hours • Press <kbd className="px-1 py-0.5 text-xs font-mono bg-white border border-gray-300 rounded">Ctrl + /</kbd> to toggle support
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpModal;