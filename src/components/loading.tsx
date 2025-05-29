import { Spinner } from "@heroui/react";

export const Loading = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
};
