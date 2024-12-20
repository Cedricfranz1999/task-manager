"use client";

import { api } from "@/trpc/react";
import React, { useEffect, useMemo, useState } from "react";
import { format, parse, parseISO } from "date-fns";
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
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm, useFieldArray } from "react-hook-form";
import {
  BookOpenIcon,
  BriefcaseIcon,
  CalendarIcon,
  Loader,
  Table,
  Timer,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

dayjs.extend(isoWeek);

type Task = {
  status: boolean;
  id: string;
  taskName: string;
  description: string;
  startDuration: string;
  endDuration: string;
  category: "education" | "work";
  Date: string;
  taskStatus: boolean;
  subtasks: SubTask[];
};

type SubTask = {
  subtaskName: string;
  status: boolean;
};

type TaskFormData = {
  taskName: string;
  description: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  category: "education" | "work";
  subtasks: SubTask[];
  taskStatus: boolean;
};

const idToColorHueConvert = (id: string) => {
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
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(true);
  const [selectCategory, setSelectedCategory] = useState<
    "both" | "education" | "work"
  >("both");

  const [status, setStatus] = useState<"both" | "done" | "pending">("both");
  const [selectedTaskData, setSelectedTaskData] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<TaskFormData>({
    defaultValues: {
      subtasks: [],
      taskStatus: false,
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

  const router = useRouter();
  const [storedEmail, setStoredEmail] = useState<string | null>(null);
  const [storedPassword, setStoredPassword] = useState<string | null>(null);
  useEffect(() => {
    setStoredEmail(localStorage.getItem("email"));
    setStoredPassword(localStorage.getItem("password"));
  }, []);

  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().startOf("week"),
  );

  const getWeekDays = (startOfWeek: dayjs.Dayjs) => {
    return Array.from({ length: 7 }, (_, index) => {
      const day = startOfWeek.add(index, "day");
      return {
        day: day.format("ddd"),
        monthDate: day.format("MMM D"),
        date: day,
      };
    });
  };

  const weekDays = getWeekDays(currentWeekStart);

  const handlePrevWeek = async () => {
    setCurrentWeekStart(currentWeekStart.subtract(7, "day"));
    refetch();
    refetchFeedback();
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(currentWeekStart.add(7, "day"));
    refetch();
    refetchFeedback();
  };

  const { data: userData } = api.Auth.getAllUser.useQuery({
    email: storedEmail || "",
  });

  const { data, refetch } = api.Task.getTask.useQuery(
    {
      selectedDate: selectedDate?.date,
      userId: userData?.[0]?.id,
      category: selectCategory,
      status: status,
    },
    {
      enabled: Boolean(userData?.length),
    },
  );
  const { data: dataStatus, refetch: refetchFeedback } =
    api.Task.GetFeedback.useQuery(
      {
        dateDays: selectedDate?.date,
        userId: userData?.[0]?.id ?? 0,
      },
      {
        enabled: Boolean(userData?.[0]?.id),
      },
    );

  const addTask = api.Task.addTask.useMutation({
    onSuccess: async () => {
      toast({
        title: "Successfully added new task",
      });
      await refetch();
      refetchFeedback();
    },
  });

  if (!data) {
    return (
      <div className="flex w-full animate-pulse flex-col items-center justify-center gap-1 bg-gray-200 py-72">
        <Loader className="animate-spin text-blue-500" />
        <p>Loading...</p>
      </div>
    );
  }

  const formatTime = (isoTime: string) => format(new Date(isoTime), "hh:mm a");

  const tasks: any[] = data.map((task: any) => ({
    id: task.id.toString(),
    taskName: task.taskname,
    description: task.Description,
    startDuration: formatTime(task.startDuration),
    endDuration: formatTime(task.endDuration),
    category: task.category,
    Date: task.Date,
    status: task.status,
    subtasks: task.subtasks.map((subtask: any) => ({
      id: subtask.id,
      subtaskName: subtask.subtaskName,
      status: subtask.status,
    })),
    updatedAt: task.updatedAt,
  }));

  const timeSlots = Array.from({ length: 24 }, (_, index) => {
    const hour = index % 12 || 12;
    const period = index < 12 ? "AM" : "PM";
    return `${hour.toString().padStart(2, "0")}:00 ${period}`;
  });

  const parseTime = (time: any) => {
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
    const startDateTime = `${data.date}T${data.timeStart}:00.000Z`;
    const endDateTime = `${data.date}T${data.timeEnd}:00.000Z`;

    const startDuration = new Date(startDateTime);
    const endDuration = new Date(endDateTime);

    const hoursToSubtract = 8;
    startDuration.setHours(startDuration.getHours() - hoursToSubtract);
    endDuration.setHours(endDuration.getHours() - hoursToSubtract);

    await addTask.mutateAsync({
      userId: userData?.[0]?.id,
      name: data.taskName,
      description: data.description,
      dateDays: parseISO(data.date),
      startDuration: startDuration,
      endDuration: endDuration,
      category: data.category,
      subtask: data.subtasks,
      status: data.taskStatus,
    });

    setOpen(false);
  };

  const handleEdit = async () => {
    if (!selectedTaskData) return;

    const formattedDate = format(new Date(selectedTaskData.Date), "yyyy-MM-dd");
    const formattedStartTime = format(
      parse(selectedTaskData.startDuration, "hh:mm a", new Date()),
      "HH:mm",
    );
    const formattedEndTime = format(
      parse(selectedTaskData.endDuration, "hh:mm a", new Date()),
      "HH:mm",
    );

    const startDateTime = `${formattedDate}T${formattedStartTime}:00.000Z`;
    const endDateTime = `${formattedDate}T${formattedEndTime}:00.000Z`;

    const startDuration = new Date(startDateTime);
    const endDuration = new Date(endDateTime);

    const hoursToSubtract = 8;
    startDuration.setHours(startDuration.getHours() - hoursToSubtract);
    endDuration.setHours(endDuration.getHours() - hoursToSubtract);

    await addTask.mutateAsync({
      TaskId: Number(selectedTaskData.id),
      name: selectedTaskData.taskName,
      description: selectedTaskData.description,
      dateDays: parseISO(formattedDate),
      startDuration: startDuration,
      endDuration: endDuration,
      category: selectedTaskData.category,
      subtask: selectedTaskData.subtasks,
      status: selectedTaskData.status,
    });
    console.log("54321", selectedTaskData.status);

    setIsEditDialogOpen(false);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTaskData(task);
    setIsEditDialogOpen(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "education":
        return <BookOpenIcon className="h-4 w-4" />;
      case "work":
        return <BriefcaseIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleChange = (value: any) => {
    setSelectedCategory(value);
  };
  const handleChangeStatus = (value: any) => {
    setStatus(value);
  };

  if (!storedEmail) {
    router.push("/sign-in");
  }
  return (
    <div className="flex max-h-48 min-h-screen flex-col items-center overflow-scroll p-4">
      <div className="flex w-full items-end"></div>
      <div></div>
      <h1 className="text-xl font-bold">Daily Task</h1>
      <div></div>
      <div className="flex w-full items-center justify-between gap-4 text-xs">
        <div className="flex items-center justify-center gap-2">
          <Label>Category:</Label>
          <Select value={selectCategory} onValueChange={handleChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Category</SelectLabel>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Label>Status:</Label>
          <Select value={status} onValueChange={handleChangeStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Status</SelectLabel>
                <SelectItem value="done">Completed</SelectItem>
                <SelectItem value={"pending"}>Pending</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-end justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Add new task</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[600px] overflow-scroll sm:max-w-[425px]">
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
                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="timeStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Duration</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timeEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Duration</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                              <FormLabel className="font-normal">
                                Work
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taskStatus"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Task Status</FormLabel>
                          <FormDescription>
                            Mark as done if the task is completed.
                          </FormDescription>
                        </div>
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
                              <Checkbox
                                checked={form.watch(`subtasks.${index}.status`)}
                                onCheckedChange={(checked) => {
                                  form.setValue(
                                    `subtasks.${index}.status`,
                                    checked ? true : false,
                                  );
                                }}
                              />
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
                      className="ml-2 mt-2"
                      onClick={() => append({ subtaskName: "", status: false })}
                    >
                      Add Subtask
                    </Button>
                  </div>
                  <Button type="submit">Add Tasksss</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <p className="mt-10 text-xs">
            Total Task:
            <span className="mx-2 font-bold">{dataStatus?.totalTasks}</span>
            Total Completed:
            <span className="mx-2 font-bold">{dataStatus?.completedTasks}</span>
            Total Percentage Done:
            <span className="mx-2 font-bold">{dataStatus?.percentage}</span>
          </p>
        </div>
      </div>
      <div
        className={`${!activeTab ? "hidden" : ""} mt-10 w-full rounded-md bg-blue-100 p-4`}
      >
        <div className="mb-1 flex w-full max-w-full items-end justify-between rounded-lg px-6 py-2 text-sm shadow-lg sm:px-32">
          <button
            className="rounded-full bg-blue-200 p-2 hover:bg-gray-300"
            onClick={handlePrevWeek}
          >
            &larr; {/* Left Arrow */}
          </button>
          {weekDays.map((data) => (
            <div
              key={data.monthDate}
              className="flex cursor-pointer flex-col items-center gap-2"
            >
              <p
                className={`rounded-full bg-red-400 px-2 py-1 text-xs text-white ${
                  format(currentDay.toDate(), "MMM dd") === data.monthDate
                    ? ""
                    : "hidden"
                }`}
              >
                Today
              </p>
              <div
                onClick={() =>
                  setSelectedDate({
                    monthDate: data.monthDate,
                    date: data.date.toDate(),
                  })
                }
                className={`flex flex-col items-center gap-1 p-4 hover:rounded-3xl hover:bg-blue-400 hover:text-white ${
                  selectedDate?.monthDate === data.monthDate
                    ? "rounded-3xl bg-blue-400 p-4 text-white"
                    : ""
                }`}
              >
                <p className="text-xs">{data.monthDate}</p>
                <p className="text-xs">{data.day}</p>
              </div>
            </div>
          ))}
          <button
            className="rounded-full bg-blue-200 p-2 hover:bg-gray-300"
            onClick={handleNextWeek}
          >
            &rarr;
          </button>
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
                    onClick={() => handleTaskClick(task)}
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
      <div
        className={`${activeTab ? "hidden" : ""} mt-10 h-full w-full rounded-md bg-blue-100`}
      >
        {tasks.map((task, index, allTasks) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const parseDate = (dateInput: string | Date): Date => {
            if (dateInput instanceof Date) {
              return dateInput;
            }
            // Try parsing as ISO string
            const isoDate = parseISO(dateInput);
            if (!isNaN(isoDate.getTime())) {
              return isoDate;
            }
            // Try parsing as "MM/DD/YYYY" format
            const parsedDate = parse(dateInput, "MM/dd/yyyy", new Date());
            if (!isNaN(parsedDate.getTime())) {
              return parsedDate;
            }
            // If all else fails, return current date
            console.error(`Invalid date format: ${dateInput}`);
            return new Date();
          };

          // Sort tasks by date
          const sortedTasks = [...tasks].sort(
            (a, b) => parseDate(a.Date).getTime() - parseDate(b.Date).getTime(),
          );

          // Group tasks by date
          // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/no-redundant-type-constituents
          const groupedTasks: { [key: string]: Task[] | any } = {};

          sortedTasks.forEach((task) => {
            const dateKey = format(parseDate(task.Date), "yyyy-MM-dd");
            if (!groupedTasks[dateKey]) {
              groupedTasks[dateKey] = [];
            }
            groupedTasks[dateKey].push(task);
          });

          // Convert object to array of entries
          const sortedAndGroupedTasks = Object.entries(groupedTasks);
          sortedAndGroupedTasks.forEach(([date, tasks]) => {
            tasks.sort((a: any, b: any) => {
              // Directly compare the time strings (HH:MM AM/PM)
              const timeA = a.startDuration;
              const timeB = b.startDuration;

              return timeA.localeCompare(timeB); // Sort by startDuration (ascending order)
            });
          });

          console.log("owshie", sortedAndGroupedTasks);
          return (
            // eslint-disable-next-line react/jsx-key
            <div className="flex h-screen w-full flex-col items-start justify-start gap-5">
              <ScrollArea className="h-screen w-full">
                <div className="container mx-auto space-y-6 p-4">
                  {sortedAndGroupedTasks.map(([date, tasks]) => (
                    <Card key={date} className="w-full">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <CalendarIcon className="h-5 w-5" />
                          <span>{format(parseISO(date), "MMMM dd, yyyy")}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {tasks.map((task: any) => (
                          <Card
                            key={task.id}
                            className="cursor-pointer bg-secondary"
                          >
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between text-lg">
                                <span>{task.taskName}</span>
                                <Badge
                                  variant={
                                    task.status ? "default" : "secondary"
                                  }
                                >
                                  {task.status ? "Completed" : "Pending"}
                                </Badge>
                              </CardTitle>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                {getCategoryIcon(task.category)}
                                <span className="capitalize">
                                  {task.category}
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <p className="text-sm">{task.description}</p>
                              <div className="text-sm text-muted-foreground">
                                {task.startDuration} - {task.endDuration}
                              </div>
                              {task.subtasks && task.subtasks.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold">Subtasks:</h4>
                                  {task.subtasks.map((subtask: any) => (
                                    <div
                                      key={subtask.id}
                                      className="flex items-center space-x-2"
                                    >
                                      <Checkbox
                                        id={`subtask-${subtask.id}`}
                                        checked={subtask.status}
                                      />
                                      <label
                                        htmlFor={`subtask-${subtask.id}`}
                                        className="text-sm"
                                      >
                                        {subtask.subtaskName}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>

      <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <AlertDialogContent className="max-h-[600px] overflow-scroll">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Task</AlertDialogTitle>
            <AlertDialogDescription>
              Make changes to your task here. Click save when youre done.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedTaskData && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-taskName" className="text-right">
                  Task Name
                </Label>
                <Input
                  id="edit-taskName"
                  value={selectedTaskData.taskName}
                  onChange={(e) =>
                    setSelectedTaskData({
                      ...selectedTaskData,
                      taskName: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={selectedTaskData.description}
                  onChange={(e) =>
                    setSelectedTaskData({
                      ...selectedTaskData,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-startDuration" className="text-right">
                  Start Time
                </Label>
                <Input
                  id="edit-startDuration"
                  defaultValue={format(
                    parse(
                      selectedTaskData.startDuration,
                      "hh:mm a",
                      new Date(),
                    ),
                    "HH:mm",
                  )}
                  onChange={(e: any) => {
                    const timeValue = e.target.value;
                    const [hours, minutes] = timeValue.split(":").map(Number);
                    const suffix = hours < 12 ? "AM" : "PM";
                    setSelectedTaskData({
                      ...selectedTaskData,
                      startDuration: `${timeValue} ${suffix}`,
                    });
                  }}
                  type="time"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-endDuration" className="text-right">
                  End Time
                </Label>
                <Input
                  id="edit-startDuration"
                  defaultValue={format(
                    parse(selectedTaskData.endDuration, "hh:mm a", new Date()),
                    "HH:mm",
                  )}
                  onChange={(e: any) => {
                    const timeValue = e.target.value;
                    const [hours, minutes] = timeValue.split(":").map(Number);
                    const suffix = hours < 12 ? "AM" : "PM";
                    setSelectedTaskData({
                      ...selectedTaskData,
                      startDuration: `${timeValue} ${suffix}`,
                    });
                  }}
                  type="time"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Category</Label>
                <RadioGroup
                  value={selectedTaskData.category}
                  onValueChange={(value: "education" | "work") =>
                    setSelectedTaskData({
                      ...selectedTaskData,
                      category: value,
                    })
                  }
                  className="col-span-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="education" id="edit-education" />
                    <Label htmlFor="edit-education">Education</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="work" id="edit-work" />
                    <Label htmlFor="edit-work">Work</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Task Status</Label>
                <div className="col-span-3">
                  <Checkbox
                    checked={selectedTaskData.status}
                    onCheckedChange={(checked) =>
                      setSelectedTaskData({
                        ...selectedTaskData,
                        status: checked ? true : false,
                      })
                    }
                  />
                  <span className="ml-2">Mark as done</span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right">Subtasks</Label>
                <div className="col-span-3 space-y-2">
                  {selectedTaskData.subtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={subtask.subtaskName}
                        onChange={(e) => {
                          const newSubtasks = [...selectedTaskData.subtasks];
                          newSubtasks[index] = {
                            ...newSubtasks[index],
                            subtaskName: e.target.value,
                          } as any;
                          setSelectedTaskData({
                            ...selectedTaskData,
                            subtasks: newSubtasks,
                          });
                        }}
                      />
                      <Checkbox
                        checked={subtask.status}
                        onCheckedChange={(checked) => {
                          const newSubtasks = [...selectedTaskData.subtasks];
                          newSubtasks[index] = {
                            ...newSubtasks[index],
                            status: checked ? true : false,
                          } as any;
                          setSelectedTaskData({
                            ...selectedTaskData,
                            subtasks: newSubtasks,
                          });
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newSubtasks = selectedTaskData.subtasks.filter(
                            (_, i) => i !== index,
                          );
                          setSelectedTaskData({
                            ...selectedTaskData,
                            subtasks: newSubtasks,
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove subtask</span>
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTaskData({
                        ...selectedTaskData,
                        subtasks: [
                          ...selectedTaskData.subtasks,
                          { subtaskName: "", status: false },
                        ],
                      });
                    }}
                  >
                    Add Subtask
                  </Button>
                </div>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEdit}>
              Save changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
