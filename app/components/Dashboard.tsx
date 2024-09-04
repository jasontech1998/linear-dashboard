"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Bell,
  Layout,
  Filter,
  MoreHorizontal,
  Plus,
  Circle,
  CheckCircle,
  Zap,
  Bug,
  FileText,
  Cpu,
  Layers,
  Clock,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

type Issue = {
  id: string;
  title: string;
  dueDate?: string;
  tags: string[];
};

type Column = {
  id: string;
  title: string;
  issues: Issue[];
};

const utils = {
  getTagIcon: (tag: string) => {
    const icons = {
      bug: Bug,
      feature: Zap,
      documentation: FileText,
      performance: Cpu,
      "ui/ux": Layers,
    };
    return icons[tag.toLowerCase() as keyof typeof icons] || Circle;
  },
  getTagColor: (tag: string) => {
    const colors = {
      bug: "bg-red-500/20 text-red-500",
      feature: "bg-blue-500/20 text-blue-500",
      documentation: "bg-purple-500/20 text-purple-500",
      performance: "bg-orange-500/20 text-orange-500",
      "ui/ux": "bg-green-500/20 text-green-500",
    } as const;
    return colors[tag.toLowerCase() as keyof typeof colors] || "bg-gray-500/20 text-gray-400";
  },
  isDateSoon: (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [month, day] = dateString.split(". ");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dueDate = new Date(
      today.getFullYear(),
      months.indexOf(month),
      parseInt(day)
    );
    if (dueDate < today) dueDate.setFullYear(dueDate.getFullYear() + 1);
    const diffDays = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
    return diffDays >= 0 && diffDays <= 3;
  },
  formatDate: (date: Date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]}. ${date.getDate()}`;
  },
};

export default function Dashboard() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "backlog",
      title: "Backlog",
      issues: [
        {
          id: "PROJ-28",
          title: "Research new testing frameworks",
          tags: ["Research"],
          dueDate: utils.formatDate(
            new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          ),
        },
        {
          id: "PROJ-29",
          title: "Update project documentation",
          tags: ["Documentation"],
        },
      ],
    },
    {
      id: "todo",
      title: "To Do",
      issues: [
        {
          id: "PROJ-49",
          title: "Implement user authentication",
          dueDate: utils.formatDate(
            new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          ),
          tags: ["Feature", "Security"],
        },
        {
          id: "PROJ-51",
          title: "Optimize database queries",
          dueDate: utils.formatDate(
            new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          ),
          tags: ["Performance"],
        },
        {
          id: "PROJ-32",
          title: "Fix login page responsiveness",
          tags: ["Bug", "UI/UX"],
        },
        { id: "PROJ-33", title: "Add error logging service", tags: ["DevOps"] },
        {
          id: "PROJ-26",
          title: "Create UI component library",
          tags: ["UI/UX"],
        },
      ],
    },
    {
      id: "inProgress",
      title: "In Progress",
      issues: [
        {
          id: "PROJ-50",
          title: "Refactor API endpoints",
          tags: ["Refactoring"],
        },
        {
          id: "PROJ-41",
          title: "Implement payment gateway",
          dueDate: utils.formatDate(
            new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
          ),
          tags: ["Feature", "Integration"],
        },
        {
          id: "PROJ-42",
          title: "Write unit tests for user service",
          tags: ["Testing"],
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      issues: [
        { id: "PROJ-37", title: "Set up CI/CD pipeline", tags: ["DevOps"] },
        { id: "PROJ-27", title: "Design database schema", tags: ["Database"] },
        {
          id: "PROJ-40",
          title: "Implement forgot password functionality",
          tags: ["Feature"],
        },
        {
          id: "PROJ-25",
          title: "Create project roadmap",
          dueDate: utils.formatDate(
            new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
          ),
          tags: ["Planning"],
        },
        {
          id: "PROJ-20",
          title: "Set up development environment",
          tags: ["Setup"],
        },
      ],
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setColumns((prevColumns) =>
        prevColumns.map((column) => ({
          ...column,
          issues: column.issues.map((issue) => ({
            ...issue,
            dueDate: issue.dueDate
              ? utils.formatDate(new Date(issue.dueDate))
              : undefined,
          })),
        }))
      );
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const newColumns = [...columns];
    const sourceColumn = newColumns.find(
      (col) => col.id === source.droppableId
    );
    const destColumn = newColumns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceColumn || !destColumn) return;

    const [movedIssue] = sourceColumn.issues.splice(source.index, 1);
    destColumn.issues.splice(destination.index, 0, movedIssue);

    setColumns(newColumns);
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white p-4 font-sans flex flex-col">
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-base font-semibold">All issues</h1>
          <Star size={14} className="text-gray-500" />
        </div>
        <div className="flex items-center space-x-4">
          <Bell size={14} className="text-gray-500" />
          <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
        </div>
      </header>
      <div className="flex justify-between items-center mb-4">
        <button className="flex items-center space-x-2 bg-[#1E1E1E] px-2 py-1 rounded text-xs">
          <Filter size={12} className="text-gray-400" />
          <span className="text-gray-300">Filter</span>
        </button>
        <button className="flex items-center space-x-2 bg-[#1E1E1E] px-2 py-1 rounded text-xs">
          <Layout size={12} className="text-gray-400" />
          <span className="text-gray-300">Display</span>
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-grow flex space-x-3 overflow-x-auto pb-4">
          {columns.map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="rounded-lg w-[280px] flex-shrink-0 flex flex-col"
                >
                  <div className="p-2 flex justify-between items-center">
                    <h2 className="font-medium flex items-center space-x-2 text-xs">
                      {column.id === "backlog" && (
                        <Circle size={12} className="text-gray-400" />
                      )}
                      {column.id === "todo" && (
                        <Circle size={12} className="text-gray-400" />
                      )}
                      {column.id === "inProgress" && (
                        <Circle size={12} className="text-blue-400" />
                      )}
                      {column.id === "done" && (
                        <CheckCircle size={12} className="text-purple-400" />
                      )}
                      <span>{column.title}</span>
                      <span className="text-gray-500">
                        {column.issues.length}
                      </span>
                      {column.id === "done" && (
                        <span className="text-[10px] text-gray-500">All</span>
                      )}
                    </h2>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <MoreHorizontal size={12} />
                      <Plus size={12} />
                    </div>
                  </div>
                  <div className="flex-grow px-1 py-0.5 overflow-y-auto">
                    {column.issues.map((issue, index) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`relative bg-neutral-600 p-px overflow-hidden rounded mb-1.5 text-xs ${
                              snapshot.isDragging ? "opacity-50" : ""
                            }`}
                          >
                            {issue.dueDate &&
                              utils.isDateSoon(issue.dueDate) &&
                              (column.id === "todo" ||
                                column.id === "inProgress") && (
                                <div className="glow inset-0 w-[100px] h-[100px] absolute rotate-45"></div>
                              )}
                            <div className="relative z-10 space-y-2 bg-[#08090a] rounded px-5 py-2">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-500 text-[10px]">
                                  {issue.id}
                                </span>
                              </div>
                              <h3 className="font-medium mb-1.5 text-gray-200">
                                {issue.title}
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                {issue.dueDate && (
                                  <span
                                    className={`flex items-center space-x-1 text-[10px] bg-[#2E2E2E] px-1.5 py-0.5 rounded-sm ${
                                      utils.isDateSoon(issue.dueDate) &&
                                      (column.id === "todo" ||
                                        column.id === "inProgress")
                                        ? "text-yellow-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    <Clock size={10} />
                                    <span>{issue.dueDate}</span>
                                  </span>
                                )}
                                {issue.tags.map((tag, i) => (
                                  <span
                                    key={i}
                                    className={`flex items-center space-x-1 text-[10px] px-1.5 py-0.5 rounded-sm ${utils.getTagColor(
                                      tag
                                    )}`}
                                  >
                                    {React.createElement(
                                      utils.getTagIcon(tag),
                                      { size: 10 }
                                    )}
                                    <span>{tag}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
