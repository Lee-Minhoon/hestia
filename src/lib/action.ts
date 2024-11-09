import { startTransition } from "react";

import { FieldValues, UseFormReturn } from "react-hook-form";

type ActionSuccess<T> = {
  status: "success";
  data: T;
  message?: string;
};

type ActionError = {
  status: "error";
  message: string;
};

type ActionIdle = {
  status: "idle";
};

export type ActionState<T> = ActionSuccess<T> | ActionError | ActionIdle;

export function initState<T>(): ActionState<T> {
  return { status: "idle" };
}

export function successState<T>(data: T, message?: string): ActionSuccess<T> {
  return { status: "success", data, message };
}

export function errorState(message: string): ActionError {
  return { status: "error", message };
}

export function handleSubmit<T extends FieldValues>(
  form: UseFormReturn<T>,
  dispatch: (value: FormData) => void
) {
  return (e: React.FormEvent<HTMLFormElement>) => {
    form.handleSubmit(() => {
      startTransition(() => {
        dispatch(new FormData(e.target as HTMLFormElement));
      });
    })(e);
  };
}
