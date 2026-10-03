interface FeedbackMessageProps {
  status: "success" | "error" | null;
  message: string;
}

export default function FeedbackMessage({ status, message }: FeedbackMessageProps) {
  if (!status || !message) return null;

  const isSuccess = status === "success";

  return (
    <div
      className={`mt-2 w-[90%] rounded-lg border px-3 py-2 text-center text-sm transition-all duration-300 ${
        isSuccess
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {message}
    </div>
  );
}
