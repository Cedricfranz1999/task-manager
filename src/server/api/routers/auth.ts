import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const auth_router = createTRPCRouter({
  Signup: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string(),
        email: z.string(),
        password: z.string(),
        age: z.number(),
        dateOfBirth: z.date(),
        phoneNumber: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      if (id) {
        return await ctx.db.user.update({
          where: { id },
          data,
        });
      } else {
        return await ctx.db.user.create({
          data,
        });
      }
    }),

  getAllUser: publicProcedure
    .input(
      z.object({
        email: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findMany({
        where: {
          email: input.email || undefined,
        },
      });
    }),

  Login: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  EditProfile: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        age: z.number(),
        dateOfBirth: z.string(),
        phoneNumber: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, name, email, age, dateOfBirth, phoneNumber, password } =
        input;

      const updatedUser = await ctx.db.user.update({
        where: { id },
        data: {
          name,
          email,
          age,
          dateOfBirth,
          phoneNumber,
          password,
        },
      });

      return updatedUser;
    }),
});
