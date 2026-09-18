type IStateError = {
  message?: string;
};

export default function StateError({ message = "An error occurred" }: IStateError) {
  return (
    <div className="w-full h-full flex-center p-6 text-center">
      <p className="text-small text-secondary-text">{message}</p>
    </div>
  );
}
