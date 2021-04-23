import { PieChart, Pie, Tooltip, Cell } from "recharts";

export default function TaskPie({ tasks, timesheets }) {

  /**
   * Builds a suitable data array from the timesheets array
   * @returns {Array} rechart pie data
   */
  const getPieData = () => {
    // Traverse timesheets
    return timesheets.map(({ id, sheets }) => {
      // Calculate overall time spent on this task
      const totalTime = sheets.reduce(
        (x, y) => x + (y.data().end - y.data().start),
        0
      );

      // Get the task doc from the id
      const taskDoc = tasks.find((t) => t.id === id);

      const deltaTime = Math.abs(totalTime) / 1000;
      const minutes = Math.floor(deltaTime / 60);

      return {
        name: taskDoc.data().name,
        minutes,
        color: taskDoc.data().color.hex,
      };
    });
  };

  const getLastUpdate = () =>
    new Date().toUTCString().split(" ").slice(-2).join(" ");

  return (
    <div className="bg-gray-800 bg-opacity-50 flex flex-col items-center rounded">
      <PieChart width={350} height={250}>
        <Pie
          data={getPieData()}
          dataKey="minutes"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          label
        >
          {getPieData().map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [`${value} Minutes`, name]}
        />
      </PieChart>
      <p className="text-gray-400 px-2 self-start">
        Last update: <span>{getLastUpdate()}</span>
      </p>
    </div>
  );
}
