import { useEffect, useState, useMemo } from "react";
import {
  getHoursFromSeconds,
  getMinutesFromSeconds,
  getSeconds,
} from "../utils/time";

// use-timer
import { useTimer } from "use-timer";

// firebase
import { db } from "../firebase";

// react-select
import Select from "react-select";
import { styles } from "../utils/selectConfig";

export default function StartTask({ state, rerender }) {
  //hooks
  const { start, reset, time } = useTimer({
    onTimeUpdate: async (time) => {
      // Update the firebase document (end time) every 2 minutes
      if (time % 120 === 0) {
        const time = new Date().getTime();
        await db
          .collection("tasks")
          .doc(currentTask.task)
          .collection("timesheets")
          .doc(currentTask.timesheet)
          .update({ end: time });
      }
    },
  });

  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(null); // docRef
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null); // {task: [id], timesheet: [id]}

  /**
   * Rerender tasks when state changes
   */
  useEffect(() => {
    getTasks();
  }, [state]);

  // methods

  /**
   * Get all tasks from firebase
   */
  const getTasks = async () => {
    // Get all tasks from firebase
    const { docs } = await db.collection("tasks").get();
    setTasks(docs);
  };

  /**
   * Array of options for Select component
   */
  const options = useMemo(() => {
    return tasks.map((task) => ({
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

  const createTimesheet = async (e) => {
    e.preventDefault();

    // If no task -> bail
    if (!task) {
      return;
    }

    setLoading(true);

    // Timesheet already running
    if (currentTask) {
      const time = new Date().getTime();

      await db
        .collection("tasks")
        .doc(currentTask.task)
        .collection("timesheets")
        .doc(currentTask.timesheet)
        .update({ end: time });

      setCurrentTask(null);
      reset(); // timer
      rerender();
    }
    // Starting a new timesheet
    else {
      const value = task.value;
      const time = new Date().getTime();
      const timesheet = await db
        .collection("tasks")
        .doc(value)
        .collection("timesheets")
        .add({ start: time, end: time });

      start(); // timer
      setCurrentTask({ task: value, timesheet: timesheet.id });
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 w-80 h-40 rounded">
      <form className="flex flex-col p-4" onSubmit={createTimesheet}>
        <Select
          onChange={setTask}
          label="Select Task"
          options={options}
          styles={styles}
        />
        <button
          disabled={loading}
          className={`
            my-4
            text-white
            border-2
            border-gray-500
            rounded
            px-4 py-2
            shadow-lg
            bg-gray-900 hover:bg-indigo-600
            active:bg-indigo-900 focus:outline-none`}
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
