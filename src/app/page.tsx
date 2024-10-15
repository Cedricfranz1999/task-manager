"use client";
import { api } from "@/trpc/react";
import React, { useState } from "react";
import { format } from "date-fns";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm, useFieldArray } from "react-hook-form";
import { X } from "lucide-react";

dayjs.extend(isoWeek);
type Task = {
  id: string;
  taskName: string;
  startDuration: string;
  endDuration: string;
};

type SubTask = {
  subtaskName: string;
};

type TaskFormData = {
  taskName: string;
  description: string;
  date: string;
  time: string;
  category: "education" | "work";
  subtasks: SubTask[];
};

export const idToColorHueConvert = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) + id.charCodeAt(i);
  }
  return Math.abs(hash) % colors.length;
};

const colors = [
  "#60a5fa",
  "#34d399",
  "#a78bfa",
  "#f97316",
  "#f472b6",
  "#2dd4bf",
  "#818cf8",
  "#facc15",
  "#4b5563",
  "#ec4899",
  "#eab308",
  "#14b8a6",
  "#e11d48",
  "#6366f1",
  "#7c3aed",
  "#d97706",
  "#3b82f6",
  "#ef4444",
  "#6b7280",
];

export default function Component() {
  const [open, setOpen] = useState(false);
  const form = useForm<TaskFormData>({
    defaultValues: {
      subtasks: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks",
  });
  const currentDay = dayjs();
  const startOfWeek = currentDay.startOf("week").add(1, "day");
  const endOfWeek = currentDay.endOf("week").add(1, "day");
  const [selectedDate, setSelectedDate] = useState<any>({
    monthDate: format(currentDay.toDate(), "MMM dd"),
    date: currentDay.toDate(),
  });

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const day = startOfWeek.add(index, "day");
    return {
      day: day.format("ddd"),
      monthDate: day.format("MMM D"),
      date: day,
    };
  });
  const { data, refetch } = api.Task.getTask.useQuery({
    selectedDate: selectedDate.date,
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  const formatTime = (isoTime: string) => format(new Date(isoTime), "hh:mm a");

  const tasks: Task[] = data.map((task: any) => ({
    id: task.id.toString(),
    taskName: task.taskname,
    startDuration: formatTime(task.startDuration),
    endDuration: formatTime(task.endDuration),
  }));

  const timeSlots = Array.from({ length: 24 }, (_, index) => {
    const hour = index % 12 || 12;
    const period = index < 12 ? "AM" : "PM";
    return `${hour.toString().padStart(2, "0")}:00 ${period}`;
  });

  const parseTime = (time: string) => {
    const [timeStr, period] = time.split(" ");
    let [hours, minutes] = timeStr.split(":").map(Number);
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    return hours * 60 + minutes;
  };

  const getTaskPosition = (task: Task, index: number, allTasks: Task[]) => {
    const startMinutes = parseTime(task.startDuration);
    const endMinutes = parseTime(task.endDuration);
    const totalMinutes = 24 * 60;
    const top = `${(startMinutes / totalMinutes) * 100}%`;
    const height = `${((endMinutes - startMinutes) / totalMinutes) * 100}%`;

    const overlappingTasks = allTasks.filter((t, i) => {
      if (i >= index) return false;
      const tStart = parseTime(t.startDuration);
      const tEnd = parseTime(t.endDuration);
      return startMinutes < tEnd && endMinutes > tStart;
    });

    const left = `${overlappingTasks.length * 20}%`;
    const width = `${100 - overlappingTasks.length * 20}%`;

    return { top, height, left, width };
  };

  const onSubmit = async (data: TaskFormData) => {
    console.log(data);
    // Here you would typically send the data to your API
    // For example: await api.Task.addTask.mutate(data);
    await refetch();
    setOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
      <div className="flex w-full items-end"></div>
      <h1 className="mb-8 text-3xl font-bold">Daily Schedule</h1>
      <div className="flex w-full items-center justify-end text-xs">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Add new task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="max-h-[200px] min-h-[100px] resize-none overflow-y-auto"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="education" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Education
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="work" />
                            </FormControl>
                            <FormLabel className="font-normal">Work</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <FormLabel>Subtasks</FormLabel>
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`subtasks.${index}.subtaskName`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="mt-2 flex items-center space-x-2">
                            <FormControl>
                              <Input {...field} placeholder="Subtask name" />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ subtaskName: "" })}
                  >
                    Add Subtask
                  </Button>
                </div>
                <Button type="submit">Add Task</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-1 flex w-full max-w-full items-end justify-between rounded-lg p-6 text-sm shadow-lg sm:px-32">
        {weekDays.map((data) => (
          <div
            key={data.monthDate}
            className="flex cursor-pointer flex-col items-center gap-2"
            onClick={() =>
              setSelectedDate({
                monthDate: data.monthDate,
                date: data.date.toDate(),
              })
            }
          >
            <p
              className={`rounded-full bg-red-400 px-2 py-1 text-xs text-white ${format(currentDay.toDate(), "MMM dd") === data.monthDate ? "" : "hidden"}`}
            >
              Today
            </p>
            <div
              className={`flex flex-col items-center gap-1 p-4 hover:rounded-3xl hover:bg-blue-400 hover:text-white ${selectedDate.monthDate === data.monthDate ? "rounded-3xl bg-blue-400 p-4 text-white" : ""}`}
            >
              <p className="text-xs">{data.monthDate}</p>
              <p className="text-xs">{data.day}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full max-w-full rounded-lg bg-white p-6 shadow-lg">
        <div className="flex">
          <div className="w-24 flex-shrink-0">
            {timeSlots.map((time, index) => (
              <div
                key={index}
                className="flex h-12 items-center justify-end pr-4"
              >
                <span className="text-sm font-medium text-gray-500">
                  {time}
                </span>
              </div>
            ))}
          </div>
          <div className="relative flex-grow border-l border-gray-200">
            {tasks.map((task, index, allTasks) => {
              const taskPosition = getTaskPosition(task, index, allTasks);
              const colorIndex = idToColorHueConvert(task.id);
              const color = colors[colorIndex];
              return (
                <div
                  key={task.id}
                  className="absolute mt-7 flex cursor-pointer items-center overflow-hidden rounded-l-xl rounded-r-md pl-2 hover:shadow-md hover:brightness-110 hover:drop-shadow-md"
                  style={{
                    top: taskPosition.top,
                    height: taskPosition.height,
                    left: taskPosition.left,
                    width: taskPosition.width,
                    backgroundColor: `${color}33`,
                    borderLeft: `4px solid ${color}`,
                    borderBottom: `1px solid ${color}`,
                  }}
                >
                  <span
                    className="truncate text-sm font-semibold"
                    style={{ color: color }}
                  >
                    {task.taskName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
