import { useState, useRef } from "react";

// Firebase
import { db } from "../firebase";

// Color picker
import ColorPicker, { useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
export default function TaskCreator({rerender}) {
  // hooks
  const [color, setColor] = useColor("hex", "#121212");
  const [loading, setLoading] = useState(false);
  const nameRef = useRef({});

  const createNewTask = async (e) => {
    e.preventDefault();

    // Get name from ref
    const name = nameRef.current.value;

    // If no name - bail
    if (name === "") {
      return;
    }

    setLoading(true);

    // Create document

    await db.collection("tasks").doc(name).set({
      name: name,
      color: color,
    });

    // Rerender the state to cause the task viewer to update
    rerender();

    // Reset name field
    nameRef.current.value = "";

    setLoading(false);
  };

  return (
    <div
      className={`
    flex
    relative
    flex-col
    max-w-lg
    items-center
    justify-between
    bg-gray-800
    shadow-lg
    rounded
    bg-opacity-50
    p-6`}
    >
      <div className="my-4">
        <h1 className="text-3xl text-white">Add Task</h1>
      </div>
      <div
        className={`
    flex
    flex-col
    gap-y-4
    items-center`}
      >
        <ColorPicker
          color={color}
          onChange={setColor}
          hideHSB
          dark
          width={350}
          height={150}
        />
        <form onSubmit={createNewTask} className="flex flex-col items-center">
          <div className="flex flex-col gap-y-1">
            <label className="text-indigo-500" htmlFor="name">
              Task Name
            </label>
            <input
              ref={nameRef}
              type="text"
              name="name"
              className="rounded-sm p-2 focus:outline-none bg-gray-200 text-gray-600 font-medium"
            />
          </div>

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
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
