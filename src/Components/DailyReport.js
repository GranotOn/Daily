import { useEffect, useState, useCallback } from "react";
import { deleteTimesheet } from "../api";
import {
  getSeconds,
  getHoursFromSeconds,
  getMinutesFromSeconds,
} from "../utils/time";
export default function DailyReport({ timesheets, rerender, tasks }) {
  const [data, setData] = useState([]);

  /**
   * @description Date in ms to hh:mm:ss format
   * @param {Date} docDate
   * @returns {String}
   */
  const formatDate = (docDate) => {
    const date = new Date(docDate);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${hours}:${minutes}:${seconds}`;
  };

  /**
   * @param {Date} start
   * @param {Date} end
   * @returns {String} description of the time between the two dates
   */
  const getDifference = (start, end) => {
    const delta = end - start;
    const seconds = Math.floor(delta / 1000);
    return `${getHoursFromSeconds(seconds)}:${getMinutesFromSeconds(
      seconds
    )}:${getSeconds(seconds)}`;
  };

  /**
   * @description Get's the color for a specific task by id
   * @param {String} taskId
   * @returns {String} hex color
   */
  const getColor = (taskId) => {
    // find task doc
    const taskDoc = tasks.find((t) => t.id === taskId);
    return taskDoc.data().color.hex;
  };

  /**
   * @description Deletes a timesheet
   * @param {Object} entry
   */
  const handleDelete = async (entry) => {
    deleteTimesheet(entry.taskId, entry.sheetId)
      .then((res) => {
        console.log("Deleted timesheet");
        // Updates the data
        rerender();
      })
      .catch((e) => console.error(e));
  };

  /**
   * @description Converts `timesheets` into table data
   * @requires timesheets (drilled as a prop)
   */
  const loadData = useCallback(() => {
    let tempData = [];
    timesheets.forEach(({ id, sheets }) => {
      sheets.forEach((sheet) =>
        tempData.push({
          taskId: id,
          sheetId: sheet.id,
          start: formatDate(sheet.data().start),
          end: formatDate(sheet.data().end),
          total: getDifference(sheet.data().start, sheet.data().end),
        })
      );
    });

    setData(tempData);
  }, [timesheets]);

  useEffect(() => {
    loadData();
  }, [timesheets, loadData]);

  return (
    <div
      className={`
    flex
    relative
    flex-col
    mx-auto
    min-w-min
    items-center
    justify-between
    bg-gray-800
    shadow-lg
    rounded
    bg-opacity-50
    p-6`}
    >
      <table className="min-w-full divide-y divide-indigo-400">
        <thead className="bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Task
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Start
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              End
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Total
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Delete</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr
              key={`task-${entry.taskId}-sheet-${index}`}
              className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-gray-600"}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                <div className="flex flex-row items-center gap-x-4">
                  <div
                    className="rounded p-2 shadow-lg"
                    style={{ backgroundColor: getColor(entry.taskId) }}
                  />
                  <span className="text-gray-200">{entry.taskId}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {entry.start}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {entry.end}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {entry.total}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  className="text-indigo-400 hover:text-indigo-600"
                  onClick={() => handleDelete(entry)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
