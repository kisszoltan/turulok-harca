"use client";

import { FormEvent, useState } from "react";
import {
  Button,
  Input,
  Link,
  Form,
  addToast,
  Card,
  CardBody,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSearchParams } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";

import { Logo } from "@/components/logo";

export default function Component() {
  const queryParams = useSearchParams();
  const { signIn } = useAuthActions();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);

    formData.append("flow", "signIn");
    formData.append("redirectTo", queryParams.get("ref") ?? "/");

    signIn("password", formData).catch((_) => {
      addToast({
        description: "Sikertelen bejelentkezés",
        color: "danger",
      });
      setSubmitting(false);
    });
  };

  return (
    <Card className="mx-auto w-full">
      <CardBody className="flex flex-col gap-4 p-12">
        <div className="flex flex-col items-center">
          <Logo size={128} />
          <p className="text-xl font-medium">Légy üdvözölve újra itt</p>
          <p className="text-small text-default-500">
            Jelentkezz be a fiókodba a folytatáshoz
          </p>
        </div>
        <Form
          className="flex flex-col"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            autoComplete="username"
            classNames={{
              base: "-mb-2.5",
              inputWrapper:
                "rounded-b-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
            }}
            label="Email cím"
            name="email"
            placeholder="Saját email címed"
            type="email"
            variant="bordered"
          />
          <Input
            isRequired
            classNames={{
              inputWrapper:
                "rounded-t-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
            }}
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Jelszó"
            name="password"
            placeholder="A regisztrációkor megadott jelszavad"
            type={isVisible ? "text" : "password"}
            variant="bordered"
          />
          {/*
          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox name="remember" size="sm">
              Remember me
            </Checkbox>
            <Link className="text-default-500" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
             */}
          <Button
            className="w-full"
            color="primary"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            type="submit"
          >
            Belépés
          </Button>
        </Form>
        {/*
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            disabled={isSubmitting}
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
          >
            Continue with Google
          </Button>
        </div>
        */}
        <p className="text-center text-small">
          Még nincs fiókod?&nbsp;
          <Link href="/auth/signup" size="sm">
            Hozz létre egyet
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}
