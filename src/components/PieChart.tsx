import { CATEGORY_COLORS, type Expense, type ExpenseCategory } from '@/lib/supabase';

interface PieChartProps {
  expenses: Expense[];
}

interface CategorySlice {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  color: string;
}

export default function PieChart({ expenses }: PieChartProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const slices: CategorySlice[] = Object.entries(
    expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    }, {})
  )
    .map(([cat, amount]) => ({
      category: cat as ExpenseCategory,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      color: CATEGORY_COLORS[cat as ExpenseCategory],
    }))
    .sort((a, b) => b.amount - a.amount);

  if (expenses.length === 0 || total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full border-4 border-dashed border-neutral-800">
          <span className="text-neutral-700">No data</span>
        </div>
        <p className="text-sm text-neutral-600">Add expenses to see the breakdown</p>
      </div>
    );
  }

  let cumulativeAngle = -90;
  const radius = 80;
  const center = 100;
  const strokeWidth = 0;

  const arcs = slices.map((slice) => {
    const startAngle = cumulativeAngle;
    const angleSpan = (slice.percentage / 100) * 360;
    const endAngle = startAngle + angleSpan;
    cumulativeAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = angleSpan > 180 ? 1 : 0;

    const midRad = ((startAngle + endAngle) / 2 * Math.PI) / 180;
    const labelR = radius * 0.65;
    const labelX = center + labelR * Math.cos(midRad);
    const labelY = center + labelR * Math.sin(midRad);

    return {
      ...slice,
      pathData: `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} ${strokeWidth} ${largeArc} 1 ${x2} ${y2} Z`,
      labelX,
      labelY,
      showLabel: angleSpan > 30,
    };
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
      <div className="relative flex-shrink-0">
        <svg viewBox="0 0 200 200" className="h-48 w-48">
          <circle cx={center} cy={center} r={radius + 2} fill="none" stroke="#262626" strokeWidth={1} />
          {arcs.map((arc) => (
            <path
              key={arc.category}
              d={arc.pathData}
              fill={arc.color}
              stroke="#0a0a0a"
              strokeWidth={1.5}
              className="transition-all duration-300 hover:opacity-80"
            />
          ))}
          <circle cx={center} cy={center} r={radius * 0.45} fill="#0a0a0a" />
          <text
            x={center}
            y={center - 6}
            textAnchor="middle"
            className="fill-neutral-500 text-[8px] font-medium uppercase tracking-wider"
          >
            Total
          </text>
          <text
            x={center}
            y={center + 8}
            textAnchor="middle"
            className="fill-neutral-100 text-[13px] font-bold"
          >
            ${total.toFixed(0)}
          </text>
        </svg>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto">
        {slices.map((slice) => (
          <div key={slice.category} className="flex items-center gap-3">
            <span
              className="h-3 w-3 flex-shrink-0 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <span className="flex-1 text-sm text-neutral-300">{slice.category}</span>
            <span className="text-sm font-medium text-neutral-100">
              ${slice.amount.toFixed(2)}
            </span>
            <span className="w-12 text-right text-xs text-neutral-500">
              {slice.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
