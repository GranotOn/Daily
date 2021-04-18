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

export default function StartTask({ state, rerender }) {
  //hooks
  const { start, reset, time } = useTimer({
    onTimeUpdate: async (time) => {
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
  const [task, setTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    getTasks();
  }, [state]);

  const options = useMemo(() => {
    return tasks.map((task) => ({
      value: task.data().name,
      label: task.data().name,
      color: task.data().color.hex,
    }));
  }, [tasks]);

  const styles = {
    option: (styles, { data, isDisabled, isSelected }) => {
      return {
        ...styles,

        color: isDisabled ? "#ccc" : isSelected ? "white" : data.color,
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled && (isSelected ? data.color : "white"),
        },
      };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot() }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };

  // methods
  const getTasks = async () => {
    // Get all tasks from firebase
    const { docs } = await db.collection("tasks").get();
    setTasks(docs);
  };

  const createTimesheet = async (e) => {
    e.preventDefault();

    if (!task) {
      return;
    }

    setLoading(true);

    // Task already running
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
    } else {
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

  const dot = (color = "#ccc") => ({
    alignItems: "center",
    display: "flex",

    ":before": {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: "block",
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });
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
