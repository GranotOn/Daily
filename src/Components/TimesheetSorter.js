import { Fragment, useState } from "react";

//UI
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";

//CONSTS
const sortOptions = [
  {
    name: "By Start Time",
    sorter: (a, b) => a.doc.data().start - b.doc.data().start,
  },
  {
    name: "By Task Name",
    sorter: (a, b) => (a.id > b.id ? 1 : -1),
  },
  {
    name: "By End Time",
    sorter: (a, b) => a.doc.data().end - b.doc.data().end,
  },
  {
    name: "By Total Time", // Longest first
    sorter: (a, b) =>
      b.doc.data().end -
      b.doc.data().start -
      (a.doc.data().end - a.doc.data().start),
  },
];

// Tailwind helper
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TimesheetSorter({ setTimesheets }) {
  const [selected, setSelected] = useState(sortOptions[0]);

  /**
   * @description Event handler for onSelect
   * @param {Object} sortOption
   */
  const handleSelection = (sortOption) => {
    setSelected(sortOption);
    setTimesheets((previousTimesheets) =>
      // Mutate last state with this sorter from sortOption
      [...previousTimesheets.sort(sortOption.sorter)]
    );
  };

  return (
    <Listbox value={selected} onChange={handleSelection}>
      {({ open }) => (
        <div className="z-10">
          <Listbox.Label className="sr-only">
            Change published status
          </Listbox.Label>
          <div className="relative">
            <div className="inline-flex shadow-sm rounded-md divide-x divide-indigo-600">
              <div className="relative z-0 inline-flex shadow-sm rounded-md divide-x divide-indigo-600">
                <div className="relative inline-flex items-center bg-indigo-400 py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-white">
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  <p className="ml-2.5 text-sm font-medium">{selected.name}</p>
                </div>
                <Listbox.Button className="relative inline-flex items-center bg-indigo-400 p-2 rounded-l-none rounded-r-md text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
                  <span className="sr-only">Change published status</span>
                  <ChevronDownIcon
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                </Listbox.Button>
              </div>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <Listbox.Option
                    key={`sort-${option.name}`}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-indigo-400" : "text-gray-900",
                        "cursor-default select-none relative p-4 text-sm"
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <p
                            className={
                              selected ? "font-semibold" : "font-normal"
                            }
                          >
                            {option.name}
                          </p>
                          {selected ? (
                            <span
                              className={
                                active ? "text-white" : "text-indigo-400"
                              }
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
}
