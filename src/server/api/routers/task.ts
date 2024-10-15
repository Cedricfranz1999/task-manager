import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Category } from "@prisma/client";

export const task_router = createTRPCRouter({
  getTask: publicProcedure
    .input(
      z.object({
        selectedDate: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log("Selected Date:", input.selectedDate);

      if (!input.selectedDate) {
        return []; // Return an empty array if no date is provided
      }

      const selectedDate = new Date(input.selectedDate);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const day = selectedDate.getDate();

      const tasks = await ctx.db.task.findMany({
        // where: {
        //   Date: {
        //     gte: new Date(year, month - 1, day),
        //     lt: new Date(year, month - 1, day + 1),
        //   },
        // },
      });

      return tasks;
    }),

  addTask: publicProcedure
    .input(
      z.object({
        TaskId: z.number().optional(),
        name: z.string(),
        description: z.string(),
        dateDays: z.date(),
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
            taskname: input.name,
            Description: input.description,
            startDuration: input.startDuration,
            endDuration: input.endDuration,
            category: input.category,
          },
        });

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
            taskname: input.name,
            Description: input.description,
            Date: input.dateDays,
            startDuration: input.startDuration,
            endDuration: input.endDuration,
            category: input.category,
            status: false, // Default status for new tasks
          },
        });

        // Check if input.subtask is defined before trying to access its length
        if (input.subtask?.length) {
          // Use optional chaining with length check
          await ctx.db.subTask.createMany({
            data: input.subtask.map(({ subtaskName, status }) => ({
              subtaskName,
              status: status !== undefined ? status : false,
              taskId: task?.id,
            })),
          });
        }
      }

      return task; // Return the created or updated task
    }),
});
