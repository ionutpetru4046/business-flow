"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { HiOutlineCheckCircle, HiOutlineTrash, HiOutlinePlusCircle } from "react-icons/hi2";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type TasksSectionProps = {
  customerId: string;
};

export default function TasksSection({ customerId }: TasksSectionProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      console.error(error);
      return;
    }
    setTasks(data ?? []);
  };

  useEffect(() => {
    if (customerId) {
      loadTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const createTask = async () => {
    if (!taskTitle.trim()) return;

    const { error } = await supabase.from("tasks").insert([
      {
        customer_id: customerId,
        title: taskTitle,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setTaskTitle("");
    await loadTasks();
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !completed })
      .eq("id", taskId);

    if (error) {
      alert(error.message);
      return;
    }

    await loadTasks();
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      alert(error.message);
      return;
    }

    await loadTasks();
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
        <HiOutlineCheckCircle className="text-xl" />
        Tasks
      </h2>

      <div className="bg-indigo-50 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="w-full border border-indigo-200 py-3 px-4 rounded-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createTask();
              }
            }}
          />
          <button
            onClick={createTask}
            className="bg-indigo-600 text-white px-4 py-3 rounded-lg"
            type="button"
            aria-label="Add task"
          >
            <HiOutlinePlusCircle />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-400">No tasks yet</div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between bg-white border rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id, task.completed)}
                  className="mr-2"
                  aria-label={`Mark task ${task.title} as completed`}
                />
                <span className={task.completed ? "line-through text-gray-500" : ""}>
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
                type="button"
                aria-label="Delete task"
              >
                <HiOutlineTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}