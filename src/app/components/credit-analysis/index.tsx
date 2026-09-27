import React, { memo, useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { calculateTotalCredit } from '@/app/util/Analysis.util';
import { Tag, Transaction } from '@/archetypes/Transaction';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartData,
  BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FiTrendingUp, FiLayers } from 'react-icons/fi';
import { BsArrowDownLeft } from 'react-icons/bs';
import DateRangeFilter, { DateRange } from '../common/DateRangeFilter';

interface TagTransaction {
  tag: Tag;
  transactions: Transaction[];
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CreditAnalysisComponent = () => {
  const [tags, setTags] = useState<TagTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const response = await axios.get('/api/transaction/tag/all', { params });
      const fetchedData = response.data.data || [];
      setTags(fetchedData);
    } catch (error) {
      console.error('Error fetching credit analysis transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const tagCreditList = useMemo(() => {
    return tags
      .map((item) => {
        const total = calculateTotalCredit(item.transactions);
        return {
          id: item.tag._id,
          name: item.tag.tag,
          color: item.tag.color || '#10b981',
          total,
          count: item.transactions.filter((t) => t.type === 'credit').length,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [tags]);

  const totalCreditSum = useMemo(() => {
    return tagCreditList.reduce((acc, curr) => acc + curr.total, 0);
  }, [tagCreditList]);

  const topCategory = tagCreditList[0]?.total > 0 ? tagCreditList[0] : null;

  const chartData: ChartData<'bar'> = useMemo(() => {
    const activeItems = tagCreditList.filter((item) => item.total > 0);
    return {
      labels: activeItems.map((item) => item.name),
      datasets: [
        {
          label: 'Credit (₹)',
          data: activeItems.map((item) => item.total),
          backgroundColor: activeItems.map((item) => item.color),
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 32,
        },
      ],
    };
  }, [tagCreditList]);

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <DateRangeFilter onDateChange={(range) => setDateRange(range)} />

      {loading ? (
        <div className="py-16 text-center text-slate-400 font-medium">
          Loading credit insights...
        </div>
      ) : (
        <>
          {/* KPI Insight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                <BsArrowDownLeft className="text-xl" />
              </div>
              <div>
                <div className="text-xs font-medium text-emerald-700/80">Total Income (Credit)</div>
                <div className="text-xl font-bold text-emerald-800">
                  ₹{totalCreditSum.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700">
                <FiTrendingUp className="text-xl" />
              </div>
              <div>
                <div className="text-xs font-medium text-indigo-700/80">Top Source</div>
                <div className="text-xl font-bold text-indigo-900 truncate max-w-[150px]">
                  {topCategory ? topCategory.name : '—'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-200/80 text-slate-700">
                <FiLayers className="text-xl" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Categories Active</div>
                <div className="text-xl font-bold text-slate-800">
                  {tagCreditList.filter((t) => t.total > 0).length} / {tagCreditList.length}
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid: Table + Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* Breakdown Table */}
            <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 overflow-hidden">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 px-1">
                Category Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                      <th className="py-2.5 px-3">Tag</th>
                      <th className="py-2.5 px-3 text-right">Inflow</th>
                      <th className="py-2.5 px-3 text-right">% Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60">
                    {tagCreditList.length === 0 || totalCreditSum === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-400 text-xs">
                          No credit transactions found in this period.
                        </td>
                      </tr>
                    ) : (
                      tagCreditList.map((tag) => {
                        const percentage =
                          totalCreditSum > 0 ? ((tag.total / totalCreditSum) * 100).toFixed(1) : '0';
                        return (
                          <tr key={tag.id} className="hover:bg-white/60 transition-colors">
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: tag.color }}
                                />
                                <span className="font-medium text-slate-800 truncate max-w-[140px]">
                                  {tag.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-right font-semibold text-emerald-600">
                              ₹{tag.total.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-3 text-right text-xs text-slate-500">
                              {percentage}%
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Chart */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-slate-800 mb-2 px-1">
                Credit Distribution Chart
              </h3>
              <div className="h-64 sm:h-72 w-full flex items-center justify-center">
                {chartData.datasets[0]?.data.length ? (
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (ctx) => ` ₹${Number(ctx.raw || 0).toLocaleString()}`,
                          },
                        },
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { font: { size: 11 } },
                        },
                        y: {
                          grid: { color: 'rgba(226, 232, 240, 0.6)' },
                          ticks: { font: { size: 11 } },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="text-xs text-slate-400 font-medium">
                    No credit transactions in this period.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const CreditAnalysis = memo(CreditAnalysisComponent);
