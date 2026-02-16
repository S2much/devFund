import { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AssetInputProps {
  userId: string;
  onAssetAdded: () => void;
}

export function AssetInput({ userId, onAssetAdded }: AssetInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    category: '',
    acquired_date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('assets').insert({
        name: formData.name,
        value: parseFloat(formData.value),
        category: formData.category,
        acquired_date: formData.acquired_date,
        user_id: userId,
      });

      if (error) throw error;

      setFormData({
        name: '',
        value: '',
        category: '',
        acquired_date: new Date().toISOString().split('T')[0],
      });
      setIsOpen(false);
      onAssetAdded();
    } catch (error) {
      console.error('Error adding asset:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <PlusCircle size={20} />
          Add Asset
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">New Asset</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Equipment, Property, Vehicle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Property, Equipment, Inventory"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Acquired Date
              </label>
              <input
                type="date"
                required
                value={formData.acquired_date}
                onChange={(e) =>
                  setFormData({ ...formData, acquired_date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Adding...' : 'Add Asset'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
