import { supabase } from './supabase';

const MYBIZ_USER_ID = 'mybiz-demo-user';
const COMPANY_NAME = 'MyBiZ Pty Ltd Evaluation';

interface MockAsset {
  name: string;
  value: number;
}

interface MockTransaction {
  type: 'revenue' | 'expense' | 'budget';
  amount: number;
  description: string;
  date: string;
}

interface MockRoadmapItem {
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'planned';
  target_date: string;
}

const mockAssets: MockAsset[] = [
  { name: 'Equipment & Machinery', value: 185000 },
  { name: 'Real Estate & Property', value: 425000 },
  { name: 'Cash & Investments', value: 127500 },
  { name: 'Inventory', value: 65000 },
  { name: 'Vehicles', value: 45000 },
];

const generateMockTransactions = (): MockTransaction[] => {
  const transactions: MockTransaction[] = [];
  const today = new Date();

  for (let monthsBack = 23; monthsBack >= 0; monthsBack--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - monthsBack);
    const dateStr = date.toISOString().split('T')[0];

    const baseRevenue = 35000 + monthsBack * 400;
    const baseExpense = 18000 + monthsBack * 200;

    transactions.push({
      type: 'revenue',
      amount: baseRevenue + Math.random() * 8000,
      description: 'Monthly service revenue',
      date: dateStr,
    });

    transactions.push({
      type: 'expense',
      amount: baseExpense + Math.random() * 4000,
      description: 'Operating expenses',
      date: dateStr,
    });

    if (monthsBack % 3 === 0) {
      transactions.push({
        type: 'budget',
        amount: 25000,
        description: 'Quarterly budget allocation',
        date: dateStr,
      });
    }
  }

  return transactions;
};

const mockRoadmapItems: MockRoadmapItem[] = [
  {
    title: 'Company Foundation & Setup',
    description: 'Established MyBiZ Pty Ltd and set up initial operations',
    status: 'completed',
    target_date: new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().split('T')[0],
  },
  {
    title: 'First Product Launch',
    description: 'Launched initial product offering to market',
    status: 'completed',
    target_date: new Date(new Date().setFullYear(new Date().getFullYear() - 2) + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    title: 'Revenue Hit $40K/Month',
    description: 'Achieved consistent monthly revenue of $40,000',
    status: 'completed',
    target_date: new Date(new Date().setFullYear(new Date().getFullYear() - 1) + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    title: 'Team Expansion to 8 Members',
    description: 'Hired and onboarded 5 new team members',
    status: 'completed',
    target_date: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
  },
  {
    title: 'Market Expansion to 3 Regions',
    description: 'Expand operations to Southeast Asia markets',
    status: 'in_progress',
    target_date: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0],
  },
  {
    title: 'Enterprise Product Development',
    description: 'Develop enterprise-tier product offering',
    status: 'in_progress',
    target_date: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
  },
  {
    title: 'Series A Funding Round',
    description: 'Raise Series A funding to accelerate growth',
    status: 'planned',
    target_date: new Date(new Date().setMonth(new Date().getMonth() + 10)).toISOString().split('T')[0],
  },
  {
    title: 'Revenue Target $100K/Month',
    description: 'Reach monthly revenue milestone of $100,000',
    status: 'planned',
    target_date: new Date(new Date().setMonth(new Date().getMonth() + 14)).toISOString().split('T')[0],
  },
];

export async function seedMockData() {
  try {
    await deleteExistingData();

    const [assetsResult, transactionsResult, roadmapResult] = await Promise.all([
      Promise.all(
        mockAssets.map((asset) =>
          supabase.from('assets').insert({
            user_id: MYBIZ_USER_ID,
            name: asset.name,
            value: asset.value,
          })
        )
      ),
      Promise.all(
        generateMockTransactions().map((tx) =>
          supabase.from('transactions').insert({
            user_id: MYBIZ_USER_ID,
            type: tx.type,
            amount: tx.amount,
            description: tx.description,
            date: tx.date,
          })
        )
      ),
      Promise.all(
        mockRoadmapItems.map((item) =>
          supabase.from('roadmap').insert({
            user_id: MYBIZ_USER_ID,
            title: item.title,
            description: item.description,
            status: item.status,
            target_date: item.target_date,
          })
        )
      ),
    ]);

    return { success: true, data: { assetsResult, transactionsResult, roadmapResult } };
  } catch (error) {
    console.error('Error seeding mock data:', error);
    throw error;
  }
}

async function deleteExistingData() {
  await Promise.all([
    supabase.from('assets').delete().eq('user_id', MYBIZ_USER_ID),
    supabase.from('transactions').delete().eq('user_id', MYBIZ_USER_ID),
    supabase.from('roadmap').delete().eq('user_id', MYBIZ_USER_ID),
  ]);
}

export function getMockUserId() {
  return MYBIZ_USER_ID;
}

export function getCompanyName() {
  return COMPANY_NAME;
}
