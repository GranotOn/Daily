import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { getTodaysTimeSheets } from "../api";

// firebase
import { db } from "../firebase";

export default function TaskPie({ tasks }) {
  //hooks
  const [lastUpdate, setLastUpdate] = useState(null);
  const [pieData, setPieData] = useState([]);

  /**
   * Constructs the pieData.
   * For each task, traverse all time sheets and calculate minutes
   * Then update pieData with that object
   */
  const getTimesheets = async () => {
    let data = await Promise.all(
      tasks.map(async (taskDoc) => {
        // Get all timestamps
        const { docs } = await getTodaysTimeSheets(taskDoc.id);
        // Reduce timesheets -> accumulate difference at each timesheet
        const totalTime = docs.reduce(
          (x, y) => x + (y.data().end - y.data().start),
          0
        );

        const deltaTime = Math.abs(totalTime) / 1000;

        const minutes = Math.floor(deltaTime / 60);

        return {
          name: taskDoc.data().name,
          minutes,
          color: taskDoc.data().color.hex,
        };
      })
    );

    setPieData(data);
  };

  useEffect(() => {
    getTimesheets();
    setLastUpdate(new Date().toUTCString().split(" ").slice(-2).join(" "));
  }, [tasks]);

  return (
    <div className="bg-gray-800 bg-opacity-50 flex flex-col items-center rounded">
      <PieChart width={350} height={250}>
        <Pie
          data={pieData}
          dataKey="minutes"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          label
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [`${value} Minutes`, name]}
        />
      </PieChart>
      <p className="text-gray-400 px-2 self-start">
        Last update: <span>{lastUpdate}</span>
      </p>
    </div>
  );
}
