type IStateEmpty = {
  message?: string;
};

export default function StateEmpty({ message = "No items found" }: IStateEmpty) {
  return (
    <div className="w-full h-full flex-center p-6 text-center">
      <p className="text-small text-secondary-text">{message}</p>
    </div>
  );
}
