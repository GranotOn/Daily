import { useState, useEffect, useCallback } from "react";
import { getTasks, getTodaysTimeSheets } from "./api";

// Page layout
import Header from "./Components/Header";
import TaskViewer from "./Components/TaskViewer";
import TaskCreator from "./Components/TaskCreator";
import TaskPie from "./Components/TaskPie";
import StartTask from "./Components/StartTask";
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
        const { docs } = await getTodaysTimeSheets(task.id);
        return { id: task.id, sheets: docs };
      })
    );

    setTimesheets(data);
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
        <main className="max-w-5xl mx-auto grid grid-flow-col grid-cols-3 my-10 gap-y-2 gap-x-6">
          {/* Start A Task */}
          <div className="row-start-1">
            <h3 className="text-indigo-400 text-lg">Timer</h3>
            <StartTask rerender={rerender} tasks={tasks} />
          </div>
          {/* Pie View */}
          <div className="row-start-1">
            <h3 className="text-indigo-400 text-lg">Monitor</h3>
            <TaskPie tasks={tasks} timesheets={timesheets} />
          </div>
          {/* Task List */}
          <div className="row-start-1">
            <h3 className="text-indigo-400 text-lg">Tasks</h3>
            <TaskViewer rerender={rerender} tasks={tasks} />
          </div>
          {/* Create A Task */}
          <div className="row-start-3 col-start-1 col-span-2">
            <h3 className="text-indigo-400 text-lg">Add A New Task Type</h3>
            <TaskCreator rerender={rerender} />
          </div>
          <div className="row-start-3">
            <h3 className="text-indigo-400 text-lg">Daily Report</h3>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
