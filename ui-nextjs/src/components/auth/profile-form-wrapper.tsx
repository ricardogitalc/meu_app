"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { CardFooter } from "../ui/card";

interface FormState {
  success?: boolean;
  error?: string;
}

type FormStateWithNull = FormState | null;

type FormAction = (
  prevState: FormStateWithNull,
  formData: FormData
) => Promise<FormState>;

export function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={disabled || pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Atualizando...
        </>
      ) : (
        "Atualizar perfil"
      )}
    </Button>
  );
}

export function FormStateHandler({
  action,
  children,
  initialValues,
}: {
  action: FormAction;
  children: React.ReactNode;
  initialValues: Record<string, string | undefined>;
}) {
  const [isDirty, setIsDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      let hasChanges = false;

      for (const [key, value] of formData.entries()) {
        const initialValue = initialValues[key] || "";
        const currentValue = value.toString();
        if (initialValue !== currentValue) {
          hasChanges = true;
          break;
        }
      }

      setIsDirty(hasChanges);
    }
  };

  const [state, formAction] = useActionState<FormStateWithNull, FormData>(
    async (prevState: FormStateWithNull, formData: FormData) => {
      const result = await action(prevState, formData);
      if (result.success) {
        setIsDirty(false);
      }
      return result;
    },
    null
  );
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({
        title: "Erro",
        description: state.error,
        variant: "destructive",
      });
    } else if (state?.success) {
      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso!",
        variant: "success",
      });
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} onChange={handleChange}>
      {children}
      <CardFooter>
        <SubmitButton disabled={!isDirty} />
      </CardFooter>
    </form>
  );
}
