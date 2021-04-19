import { useState, useMemo } from "react";
import {
  getHoursFromSeconds,
  getMinutesFromSeconds,
  getSeconds,
} from "../utils/time";

// use-timer
import { useTimer } from "use-timer";

// api
import { updateEndTime, createTimesheet } from "../api";

// react-select
import Select from "react-select";
import { styles } from "../utils/selectConfig";

export default function StartTask({ rerender, tasks }) {
  //hooks
  const { start, reset, time } = useTimer({
    onTimeUpdate: async (time) => {
      // Update the firebase document (end time) every 2 minutes
      if (time % 120 === 0 && currentTask) {
        const time = new Date().getTime();
        updateEndTime(currentTask.task, currentTask.timesheet, time);
        rerender();
      }
    },
  });

  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(null); // docRef
  const [currentTask, setCurrentTask] = useState(null); // {task: [id], timesheet: [id]}

  /**
   * Array of options for Select component
   */
  const options = useMemo(() => {
    return tasks?.map((task) => ({
      value: task.data().name,
      label: task.data().name,
      color: task.data().color.hex,
    }));
  }, [tasks]);

  /**
   * If starting a new timesheet, appends it in firebase and determines start & end values.
   * If ending the existing timesheet, updates the end time.
   * @param {Object} e form submit event object
   * @returns {null}
   */

  const handleSubmit = (e) => {
    e.preventDefault();

    // If no task -> bail
    if (!task) {
      return;
    }

    setLoading(true);

    // Timesheet already running
    if (currentTask) {
      // Get current time
      const time = new Date().getTime();

      console.log(currentTask);
      // Update end time
      updateEndTime(currentTask.task, currentTask.timesheet, time);

      // Reset task
      setCurrentTask(null);
      reset(); // timer
      rerender(); // global state
    }
    // Starting a new timesheet
    else {
      const value = task.value;
      const time = new Date().getTime();
      createTimesheet(value, time).then((timesheet) => {
        start(); // timer
        setCurrentTask({ task: value, timesheet: timesheet.id });
      });
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 w-80 h-40 rounded">
      <form className="flex flex-col p-4" onSubmit={handleSubmit}>
        <Select
          onChange={setTask}
          label="Select Task"
          options={options}
          styles={styles}
        />
        <button
          disabled={loading}
          className={
            `
            my-4
            text-white
            border-2
            border-gray-500
            rounded
            px-4 py-2
            shadow-lg
            hover:bg-indigo-600
            active:bg-indigo-900 focus:outline-none ` +
            (currentTask ? "bg-gray-900" : "bg-green-400")
          }
        >
          {currentTask ? "Stop" : "Start"}
        </button>
        {currentTask && (
          <p className="text-gray-400 text-center text-lg">
            Elapsed time:{" "}
            <span className="text-white">{getHoursFromSeconds(time)}</span>:
            <span className="text-white">{getMinutesFromSeconds(time)}</span>:
            <span className="text-white">{getSeconds(time)}</span>
          </p>
        )}
      </form>
    </div>
  );
}
