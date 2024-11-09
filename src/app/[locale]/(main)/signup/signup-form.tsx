"use client";

import { useActionState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useActionToast from "@/hooks/use-action-toast";
import { handleSubmit, initState } from "@/lib/action";
import { insertUserSchema } from "@/lib/db/schema";

import { signupAction } from "./actions";

export default function SignupForm() {
  const [state, dispatch, isPending] = useActionState(
    signupAction,
    initState()
  );
  useActionToast(state);

  const form = useForm<z.infer<typeof insertUserSchema>>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  return (
    <Card className="w-[320px] md:w-[400px]">
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>Signup to create an account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            action={dispatch}
            onSubmit={handleSubmit(form, dispatch)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input required placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your email address for signin.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="password"
                      autoComplete="current-password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      required
                      autoComplete="username"
                      placeholder="Username"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              Join
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-xs text-muted-foreground">Welcome to the hestia.</p>
      </CardFooter>
    </Card>
  );
}
