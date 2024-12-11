import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Category } from "@prisma/client";
import dayjs from "dayjs";

export const task_router = createTRPCRouter({
  getTask: publicProcedure
    .input(
      z.object({
        selectedDate: z.date().optional().nullable(),
        userId: z.number().optional(),
        category: z.enum(["education", "work", "both"]),
        status: z.enum(["done", "pending", "both"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const categoryCondition =
        input.category === "both" ? {} : { category: input.category };

      // Status condition
      let statusCondition = {};
      if (input.status === "done") {
        statusCondition = { status: true };
      } else if (input.status === "pending") {
        statusCondition = { status: false };
      }

      if (!input.selectedDate) {
        const allTasks = await ctx.db.task.findMany({
          include: {
            subtasks: true,
          },
          where: {
            userId: input.userId ?? 13,
            ...categoryCondition,
            ...statusCondition, // Apply the status condition
          },
        });
        return allTasks;
      }

      const selectedDate = new Date(input.selectedDate);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const day = selectedDate.getDate();

      const tasks = await ctx.db.task.findMany({
        where: {
          userId: input.userId ?? 13,

          Date: {
            gte: new Date(year, month, day),
            lt: new Date(year, month, day + 1),
          },
          ...categoryCondition,
          ...statusCondition, // Apply the status condition
        },
        include: {
          subtasks: true,
        },
        orderBy: {
          startDuration: "asc",
        },
      });

      return tasks;
    }),

  addTask: publicProcedure
    .input(
      z.object({
        userId: z.number().optional(),
        TaskId: z.number().optional(),
        name: z.string(),
        description: z.string(),
        dateDays: z.date(),
        status: z.boolean(),
        startDuration: z.date(),
        endDuration: z.date(),
        category: z.enum([Category.education, Category.work]),
        subtask: z
          .array(
            z.object({
              id: z.number().optional(),
              subtaskName: z.string(),
              status: z.boolean().optional(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let task: any;

      if (input.TaskId) {
        // If TaskId is provided, update the existing task
        task = await ctx.db.task.update({
          where: { id: input.TaskId },
          data: {
            userId: input.userId,
            taskname: input.name,
            Description: input.description,
            startDuration: input.startDuration,
            endDuration: input.endDuration,
            category: input.category,
            status: input.status,
          },
        });

        // Fetch existing subtasks for comparison
        const existingSubtasks = await ctx.db.subTask.findMany({
          where: { taskId: input.TaskId },
          select: { id: true },
        });

        const inputSubtaskIds =
          input.subtask?.map((sub) => sub.id).filter(Boolean) || [];

        // Delete subtasks that are not in the input.subtask array
        const subtasksToDelete = existingSubtasks
          .filter((existingSub) => !inputSubtaskIds.includes(existingSub.id))
          .map((sub) => sub.id);

        if (subtasksToDelete.length > 0) {
          await ctx.db.subTask.deleteMany({
            where: {
              id: { in: subtasksToDelete },
            },
          });
        }

        // Update existing subtasks
        const updates =
          input.subtask
            ?.filter((sub) => sub.id) // Use optional chaining here
            .map(({ id, subtaskName, status }) => ({
              where: { id },
              data: {
                subtaskName,
                status: status !== undefined ? status : undefined,
              },
            })) || []; // Default to an empty array if subtask is undefined

        for (const update of updates) {
          await ctx.db.subTask.update({
            where: update.where,
            data: update.data,
          });
        }

        // Create new subtasks for those without IDs
        if (input.subtask) {
          await Promise.all(
            input.subtask
              .filter((sub) => !sub.id)
              .map(({ subtaskName, status }) => {
                return ctx.db.subTask.create({
                  data: {
                    subtaskName,
                    status: status !== undefined ? status : false,
                    taskId: task.id,
                  },
                });
              }),
          );
        }
      } else {
        task = await ctx.db.task.create({
          data: {
            userId: input.userId,
            taskname: input.name,
            Description: input.description,
            Date: input.dateDays,
            startDuration: input.startDuration,
            endDuration: input.endDuration,
            category: input.category,
            status: false, // Default status for new tasks
          },
        });

        if (input.subtask?.length) {
          await ctx.db.subTask.createMany({
            data: input.subtask.map(({ subtaskName, status }) => ({
              subtaskName,
              status: status !== undefined ? status : false,
              taskId: task?.id,
            })),
          });
        }
      }

      return task;
    }),
  GetFeedback: publicProcedure
    .input(
      z.object({
        dateDays: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // If dateDays is not provided, default to the current date
      const dateToUse = input.dateDays || new Date();

      // Format the date as 'YYYY-MM-DD'
      const selectedDate = dayjs(dateToUse).format("YYYY-MM-DD");

      // Ensure that the time is treated as UTC by appending 'Z'
      const startOfDay = new Date(`${selectedDate}T00:00:00Z`);
      const endOfDay = new Date(`${selectedDate}T23:59:59Z`);

      // Count the total tasks for the selected day
      const totalTasks = await ctx.db.task.count({
        where: {
          Date: {
            gte: startOfDay, // Start of the day in UTC
            lt: endOfDay, // End of the day in UTC
          },
        },
      });

      // Count the number of completed tasks for the selected day
      const completedTasks = await ctx.db.task.count({
        where: {
          status: true, // Only count completed tasks
          Date: {
            gte: startOfDay, // Start of the day in UTC
            lt: endOfDay, // End of the day in UTC
          },
        },
      });

      // Calculate the percentage of completed tasks
      const percentage =
        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      return {
        totalTasks,
        completedTasks,
        percentage,
      };
    }),
});
