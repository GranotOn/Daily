import { useState, useEffect, useCallback } from "react";
import { getTasks, getTodaysTimesheets } from "./api";

// Page layout
import Header from "./Components/Header";
import TaskViewer from "./Components/TaskViewer";
import TaskCreator from "./Components/TaskCreator";
import TaskPie from "./Components/TaskPie";
import StartTask from "./Components/StartTask";
import DailyReport from "./Components/DailyReport";
import TimesheetSorter from "./Components/TimesheetSorter";
function App() {
  const [state, setState] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [timesheets, setTimesheets] = useState([]);

  // Force trigger a rerender (fetch api data)
  const rerender = () => setState(!state);

  /**
   * @description Loads tasks (firebase doc)
   */
  const loadTasks = async () => {
    getTasks().then((data) => setTasks(data));
  };

  /**
   * @description Loads (daily) timesheets per doc in `tasks`
   */
  const loadTimeSheets = useCallback(async () => {
    const data = await Promise.all(
      tasks.map(async (task) => {
        const { docs } = await getTodaysTimesheets(task.id);
        return Promise.all(docs.map(async (doc) => ({ id: task.id, doc })));
      })
    );

    // Returns as [[<Promise>+], [<Promise>+],...], need to flatten
    setTimesheets(data.flat());
  }, [tasks]);

  useEffect(() => {
    loadTasks();
  }, [state]);

  useEffect(() => {
    loadTimeSheets();
  }, [tasks, loadTimeSheets]);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-gray-900">
      <div className="flex flex-col p-6 relative overflow-auto w-screen h-screen">
        {/* Header section */}
        <Header />
        <main className="max-w-5xl mx-auto grid grid-flow-col grid-cols-2 my-10 gap-y-2 gap-x-6 min-w-max ">
          {/* Start A Task */}
          <div className="row-start-1">
            <h3 className="text-indigo-400 text-lg">Timer</h3>
            <StartTask rerender={rerender} tasks={tasks} />
          </div>
          {/* Pie View */}
          <div className="row-start-1 max-w-max">
            <h3 className="text-indigo-400 text-lg">Monitor</h3>
            <TaskPie tasks={tasks} timesheets={timesheets} />
          </div>
          {/* Task List */}
          <div className="row-start-1">
            <h3 className="text-indigo-400 text-lg">Tasks</h3>
            <TaskViewer rerender={rerender} tasks={tasks} />
          </div>
          {/* Create A Task */}
          <div className="row-start-3 col-start-1 flex flex-col items-start max-w-min">
            <h3 className="text-indigo-400 text-lg">Add A New Task Type</h3>
            <TaskCreator rerender={rerender} />
          </div>
          <div className="row-start-3">
            <div className="flex flex-row items-end justify-between mb-2">
              <h3 className="text-indigo-400 text-lg">Daily Report</h3>
              <TimesheetSorter setTimesheets={setTimesheets} />
            </div>
            <DailyReport
              rerender={rerender}
              timesheets={timesheets}
              tasks={tasks}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
