import { useState } from "react";

// Page layout
import Header from "./Components/Header";
import TaskViewer from "./Components/TaskViewer";
import TaskCreator from "./Components/TaskCreator";
import TaskPie from "./Components/TaskPie";
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
        {/* Create and review tasks section */}
        <div className="max-w-5xl mx-auto flex gap-x-2 items-center">
          {/* Create A Task */}

          <div>
            <TaskCreator rerender={rerender} />
          </div>

          {/* Task List */}

          <div>
            <TaskViewer state={state} rerender={rerender} />
            <TaskPie state={state} />
          </div>

          {/* Pie View */}
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default App;
