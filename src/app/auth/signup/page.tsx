"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Checkbox,
  Link,
  Form,
  addToast,
  Card,
  CardBody,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuthActions } from "@convex-dev/auth/react";

import { Logo } from "@/components/logo";

export default function Component() {
  const { signIn } = useAuthActions();
  const [agreed, setAgreed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);

    formData.append("flow", "signUp");
    signIn("password", formData)
      .catch(() =>
        addToast({
          color: "danger",
          title: "Nem sikerült regisztrálni!",
          description: "Vagy már létezik a fiók, vagy a jelszó nem megfelelő.",
        }),
      )
      .finally(() => setSubmitting(false));
  };

  return (
    <Card className="mx-auto max-w-lg">
      <CardBody className="flex flex-col gap-4 p-12">
        <div className="flex flex-col items-center">
          <Logo size={128} />
          <p className="text-xl font-medium">Légy üdvözölve!</p>
          <p className="text-small text-default-500">
            A kezdéshez hozz létre egy fiókot
          </p>
        </div>
        <Form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col w-full">
            <Input
              isRequired
              autoComplete="email"
              classNames={{
                base: "-mb-[2px]",
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
              autoComplete="password"
              classNames={{
                base: "-mb-[2px]",
                inputWrapper:
                  "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
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
              placeholder="Adj meg egy jelszót"
              type={isVisible ? "text" : "password"}
              variant="bordered"
            />
            <Input
              isRequired
              autoComplete="password"
              classNames={{
                inputWrapper: "rounded-t-none",
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
              label="Jelszó megerősítése"
              name="confirmPassword"
              placeholder="Írd be újra a fenti jelszót"
              type={isVisible ? "text" : "password"}
              variant="bordered"
            />
          </div>
          <Checkbox
            isRequired
            className="py-4"
            isSelected={agreed}
            name="accept"
            size="sm"
            onValueChange={setAgreed}
          >
            Elovastam és elfogadom az &nbsp;
            <Link href="/legal/terms" size="sm">
              Általános Szerződési Feltételek
            </Link>
            &nbsp; és az&nbsp;
            <Link href="/legal/privacy" size="sm">
              Adatkezelési Nyiltakozat
            </Link>{" "}
            dokumentumokban foglaltakat.
          </Checkbox>
          <Button
            className="w-full"
            color="primary"
            isDisabled={!agreed || isSubmitting}
            type="submit"
          >
            Létrehozás
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
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
          >
            Sign Up with Google
          </Button>
        </div>
        */}
        <p className="text-center text-small">
          Már van fiókod?&nbsp;
          <Link href="/auth/signin" size="sm">
            Jelentkezz be
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}
