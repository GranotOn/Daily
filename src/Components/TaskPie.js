import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

// firebase
import { db } from "../firebase";

export default function TaskPie({ tasks }) {
  //hooks
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
        const { docs } = await db
          .collection("tasks")
          .doc(taskDoc.id)
          .collection("timesheets")
          .get();

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

  /**
   * Rerender timesheets when tasks change (a derivative from when `state` changes)
   */
  useEffect(() => {
    getTimesheets();
  }, [tasks]);


  return (
    <div className="bg-gray-800 bg-opacity-50">
      <PieChart width={350} height={350}>
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
    </div>
  );
}
