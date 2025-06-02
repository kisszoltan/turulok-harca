import { FC } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

import { format } from "@/shared/utils";

export const VoteChart: FC<{
  votesHungeros?: number;
  votesWesteria?: number;
}> = ({ votesHungeros, votesWesteria }) => {
  const data = [
    {
      name: "hungeros",
      value: votesHungeros ?? 0,
    },
    {
      name: "westeria",
      value: votesWesteria ?? 0,
    },
  ];

  return (
    <PieChart height={20} width={20}>
      <Tooltip
        content={() => (
          <div className="flex gap-4 bg-background border py-1 px-2 rounded-md">
            <span className="text-primary-500">
              Össz.: {format((votesHungeros ?? 0) + (votesWesteria ?? 0))}
            </span>
            <span className="text-orange-500">
              Hun.: {format(votesHungeros)}
            </span>
            <span className="text-green-500">
              Wes.: {format(votesWesteria)}
            </span>
          </div>
        )}
        viewBox={{ x: 0, y: 0, width: 400 }}
      />
      <Pie
        cx="50%"
        cy="50%"
        data={data}
        dataKey="value"
        nameKey="name"
        outerRadius={10}
        strokeWidth={0}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={entry.name === "hungeros" ? "#f97316" : "#22c55e"}
          />
        ))}
      </Pie>
    </PieChart>
  );
};
