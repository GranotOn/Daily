import { useState } from "react";

// Page layout
import Header from "./Components/Header";
import TaskViewer from "./Components/TaskViewer";
import TaskCreator from "./Components/TaskCreator";
import TaskPie from "./Components/TaskPie";
import StartTask from "./Components/StartTask";
function App() {
  const [state, setState] = useState(false);

  const rerender = () => setState(!state);

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-gray-900">
      <div className="w-full h-full relative overflow-y-auto bg-gray-900 grid grid-flow-row py-10 gap-y-6">
        {/* Header section */}
        <div className="mx-auto">
          <Header />
        </div>
        <div className="mx-auto">
          <StartTask state={state} rerender={rerender} />
        </div>
        {/* Create and review tasks section */}
        <div className="max-w-5xl mx-auto flex gap-x-2 items-center flex-col gap-y-2 lg:flex-row">
          {/* Create A Task */}

          <TaskCreator rerender={rerender} />

          {/* Task List */}

          <TaskPie state={state} />
          <TaskViewer state={state} rerender={rerender} />

          {/* Pie View */}
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default App;
