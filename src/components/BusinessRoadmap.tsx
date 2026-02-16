import { useEffect, useState } from 'react';
import { PlusCircle, X, CheckCircle, Clock, Calendar, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type RoadmapItem = Database['public']['Tables']['roadmap_items']['Row'];

interface BusinessRoadmapProps {
  userId: string;
  refresh: number;
}

const suggestedItems = [
  {
    title: 'Quarterly Financial Review',
    description: 'Review financial statements and adjust budget allocations',
    priority: 'high' as const,
  },
  {
    title: 'Cost Optimization Analysis',
    description: 'Identify areas to reduce expenses and improve profit margins',
    priority: 'medium' as const,
  },
  {
    title: 'Revenue Stream Diversification',
    description: 'Explore new revenue opportunities and market segments',
    priority: 'high' as const,
  },
  {
    title: 'Asset Portfolio Review',
    description: 'Evaluate current assets and plan for future acquisitions',
    priority: 'medium' as const,
  },
];

export function BusinessRoadmap({ userId, refresh }: BusinessRoadmapProps) {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    target_date: '',
  });

  useEffect(() => {
    fetchRoadmapItems();
  }, [userId, refresh]);

  const fetchRoadmapItems = async () => {
    try {
      const { data, error } = await supabase
        .from('roadmap_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching roadmap items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRoadmapItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('roadmap_items').insert({
        title: formData.title,
        description: formData.description,
        type: 'user_defined',
        priority: formData.priority,
        target_date: formData.target_date || null,
        user_id: userId,
      });

      if (error) throw error;

      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        target_date: '',
      });
      setIsAddingItem(false);
      fetchRoadmapItems();
    } catch (error) {
      console.error('Error adding roadmap item:', error);
    }
  };

  const addSuggestedItem = async (suggested: (typeof suggestedItems)[0]) => {
    try {
      const { error } = await supabase.from('roadmap_items').insert({
        title: suggested.title,
        description: suggested.description,
        type: 'suggested',
        priority: suggested.priority,
        user_id: userId,
      });

      if (error) throw error;
      fetchRoadmapItems();
    } catch (error) {
      console.error('Error adding suggested item:', error);
    }
  };

  const updateStatus = async (
    id: string,
    status: 'planned' | 'in_progress' | 'completed'
  ) => {
    try {
      const { error } = await supabase
        .from('roadmap_items')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchRoadmapItems();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase.from('roadmap_items').delete().eq('id', id);

      if (error) throw error;
      fetchRoadmapItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'in_progress':
        return <Clock size={16} className="text-blue-600" />;
      default:
        return <Calendar size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Business Roadmap</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSuggested(!showSuggested)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Lightbulb size={20} />
            Suggestions
          </button>
          <button
            onClick={() => setIsAddingItem(!isAddingItem)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={20} />
            Add Item
          </button>
        </div>
      </div>

      {showSuggested && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb size={20} className="text-yellow-600" />
            Suggested Roadmap Items
          </h3>
          <div className="grid gap-3">
            {suggestedItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-start"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>
                </div>
                <button
                  onClick={() => addSuggestedItem(item)}
                  className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAddingItem && (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">New Roadmap Item</h3>
            <button
              onClick={() => setIsAddingItem(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={addRoadmapItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Launch new product line"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the roadmap item..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={formData.target_date}
                  onChange={(e) =>
                    setFormData({ ...formData, target_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Roadmap Item
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {items.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              No roadmap items yet. Add your first item or explore suggestions!
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(item.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    {item.type === 'suggested' && (
                      <Lightbulb size={16} className="text-yellow-600" />
                    )}
                  </div>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  )}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                        item.priority
                      )}`}
                    >
                      {item.priority}
                    </span>
                    {item.target_date && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(item.target_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-gray-400 hover:text-red-600 ml-4"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => updateStatus(item.id, 'planned')}
                  className={`px-3 py-1 rounded text-sm ${
                    item.status === 'planned'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Planned
                </button>
                <button
                  onClick={() => updateStatus(item.id, 'in_progress')}
                  className={`px-3 py-1 rounded text-sm ${
                    item.status === 'in_progress'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateStatus(item.id, 'completed')}
                  className={`px-3 py-1 rounded text-sm ${
                    item.status === 'completed'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
